const hre = require("hardhat");

async function main() {
  console.log("🚀 Setting up complete demo environment...\n");

  const [deployer, vcManager, lp1, lp2, startup1] = await hre.ethers.getSigners();

  console.log("📋 Test Accounts:");
  console.log("  Deployer (Account 0):", deployer.address);
  console.log("  VC Manager (Account 1):", vcManager.address);
  console.log("  LP 1 (Account 2):", lp1.address);
  console.log("  LP 2 (Account 3):", lp2.address);
  console.log("  Startup (Account 4):", startup1.address);
  console.log("");

  // Step 1: Deploy MockUSDC
  console.log("1️⃣  Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("   ✅ MockUSDC deployed:", mockUSDCAddress);

  // Step 2: Distribute tokens to test accounts
  console.log("\n2️⃣  Distributing MockUSDC to test accounts...");
  const transferAmount = hre.ethers.parseUnits("100000", 6); // 100,000 USDC
  
  // Transfer to VC Manager
  await mockUSDC.transfer(vcManager.address, transferAmount);
  console.log("   ✅ VC Manager:", hre.ethers.formatUnits(transferAmount, 6), "mUSDC");

  // Transfer to LP 1
  await mockUSDC.transfer(lp1.address, transferAmount);
  console.log("   ✅ LP 1:", hre.ethers.formatUnits(transferAmount, 6), "mUSDC");

  // Transfer to LP 2
  await mockUSDC.transfer(lp2.address, transferAmount);
  console.log("   ✅ LP 2:", hre.ethers.formatUnits(transferAmount, 6), "mUSDC");

  // Transfer to Startup
  await mockUSDC.transfer(startup1.address, hre.ethers.parseUnits("10000", 6));
  console.log("   ✅ Startup:", "10,000 mUSDC");

  // Step 3: Deploy FundFactory
  console.log("\n3️⃣  Deploying FundFactory...");
  const FundFactory = await hre.ethers.getContractFactory("FundFactory");
  const fundFactory = await FundFactory.deploy();
  await fundFactory.waitForDeployment();
  const fundFactoryAddress = await fundFactory.getAddress();
  console.log("   ✅ FundFactory deployed:", fundFactoryAddress);

  // Step 4: Create a demo fund
  console.log("\n4️⃣  Creating demo fund...");
  const tx = await fundFactory.connect(vcManager).createFund(mockUSDCAddress, 20);
  const receipt = await tx.wait();

  // Get fund address
  let fundCreatedEvent = null;
  for (const log of receipt.logs) {
    try {
      const parsed = fundFactory.interface.parseLog(log);
      if (parsed && parsed.name === "FundCreated") {
        fundCreatedEvent = parsed;
        break;
      }
    } catch (e) {
      // Continue searching
    }
  }

  let fundAddress, lpTokenAddress;
  if (fundCreatedEvent) {
    fundAddress = fundCreatedEvent.args.fundAddress;
    lpTokenAddress = fundCreatedEvent.args.lpTokenAddress;
  } else {
    const allFunds = await fundFactory.getAllFunds();
    fundAddress = allFunds[allFunds.length - 1];
    const Fund = await hre.ethers.getContractFactory("Fund");
    const tempFund = Fund.attach(fundAddress);
    lpTokenAddress = await tempFund.lpToken();
  }

  console.log("   ✅ Fund created:", fundAddress);
  console.log("   ✅ LP Token:", lpTokenAddress);

  // Save addresses
  const fs = require("fs");
  const addresses = {
    mockUSDC: mockUSDCAddress,
    fundFactory: fundFactoryAddress,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
  };

  fs.writeFileSync(
    "./frontend/src/utils/contractAddresses.json",
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n=== Setup Complete ===");
  console.log("\n📊 Contract Addresses:");
  console.log("   MockUSDC:", mockUSDCAddress);
  console.log("   FundFactory:", fundFactoryAddress);
  console.log("   Demo Fund:", fundAddress);
  console.log("   LP Token:", lpTokenAddress);

  console.log("\n💰 Account Balances:");
  const vcBalance = await mockUSDC.balanceOf(vcManager.address);
  const lp1Balance = await mockUSDC.balanceOf(lp1.address);
  const lp2Balance = await mockUSDC.balanceOf(lp2.address);
  const startupBalance = await mockUSDC.balanceOf(startup1.address);

  console.log("   VC Manager:", hre.ethers.formatUnits(vcBalance, 6), "mUSDC");
  console.log("   LP 1:", hre.ethers.formatUnits(lp1Balance, 6), "mUSDC");
  console.log("   LP 2:", hre.ethers.formatUnits(lp2Balance, 6), "mUSDC");
  console.log("   Startup:", hre.ethers.formatUnits(startupBalance, 6), "mUSDC");

  console.log("\n🎯 Next Steps:");
  console.log("   1. Start frontend: cd frontend && npm run dev");
  console.log("   2. Open http://localhost:3000");
  console.log("   3. Connect MetaMask with Account 1 (VC Manager)");
  console.log("   4. You'll see the demo fund on the home page");
  console.log("   5. Click on the fund to see the dashboard");
  console.log("\n✅ All accounts have funds and a demo fund is ready!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

