const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Complete Test Flow...\n");

  const [deployer, vcManager, lp1, lp2, startup1] = await hre.ethers.getSigners();

  console.log("📋 Test Accounts:");
  console.log("  Deployer:", deployer.address);
  console.log("  VC Manager:", vcManager.address);
  console.log("  LP 1:", lp1.address);
  console.log("  LP 2:", lp2.address);
  console.log("  Startup 1:", startup1.address);
  console.log("");

  // Step 1: Deploy MockUSDC
  console.log("1️⃣  Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("   ✅ MockUSDC deployed:", mockUSDCAddress);

  // Transfer USDC to test accounts
  const transferAmount = hre.ethers.parseUnits("100000", 6);
  await mockUSDC.transfer(vcManager.address, transferAmount);
  await mockUSDC.transfer(lp1.address, transferAmount);
  await mockUSDC.transfer(lp2.address, transferAmount);
  console.log("   ✅ Transferred USDC to test accounts");

  // Step 2: Deploy FundFactory
  console.log("\n2️⃣  Deploying FundFactory...");
  const FundFactory = await hre.ethers.getContractFactory("FundFactory");
  const fundFactory = await FundFactory.deploy();
  await fundFactory.waitForDeployment();
  const fundFactoryAddress = await fundFactory.getAddress();
  console.log("   ✅ FundFactory deployed:", fundFactoryAddress);

  // Step 3: Create Fund
  console.log("\n3️⃣  Creating Fund...");
  const tx = await fundFactory.connect(vcManager).createFund(mockUSDCAddress, 20);
  const receipt = await tx.wait();
  
    // Get fund address from event
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
      // Fallback: get from factory
      const allFunds = await fundFactory.getAllFunds();
      fundAddress = allFunds[allFunds.length - 1];
      // Get LP token from fund
      const FundContract = await hre.ethers.getContractFactory("Fund");
      const tempFund = FundContract.attach(fundAddress);
      lpTokenAddress = await tempFund.lpToken();
    }
  
  console.log("   ✅ Fund created:", fundAddress);
  console.log("   ✅ LP Token:", lpTokenAddress);

  const Fund = await hre.ethers.getContractFactory("Fund");
  const fund = Fund.attach(fundAddress);

  // Step 4: LP1 Deposits
  console.log("\n4️⃣  LP1 Depositing 10,000 USDC...");
  const depositAmount1 = hre.ethers.parseUnits("10000", 6);
  await mockUSDC.connect(lp1).approve(fundAddress, depositAmount1);
  await fund.connect(lp1).deposit(depositAmount1);
  console.log("   ✅ LP1 deposited successfully");

  const lp1Balance = await fund.lpContributions(lp1.address);
  console.log("   📊 LP1 Contribution:", hre.ethers.formatUnits(lp1Balance, 6), "USDC");

  // Step 5: LP2 Deposits
  console.log("\n5️⃣  LP2 Depositing 20,000 USDC...");
  const depositAmount2 = hre.ethers.parseUnits("20000", 6);
  await mockUSDC.connect(lp2).approve(fundAddress, depositAmount2);
  await fund.connect(lp2).deposit(depositAmount2);
  console.log("   ✅ LP2 deposited successfully");

  const lp2Balance = await fund.lpContributions(lp2.address);
  console.log("   📊 LP2 Contribution:", hre.ethers.formatUnits(lp2Balance, 6), "USDC");

  // Step 6: VC Invests
  console.log("\n6️⃣  VC Investing 15,000 USDC in Startup...");
  const investAmount = hre.ethers.parseUnits("15000", 6);
  await fund.connect(vcManager).invest(
    startup1.address,
    investAmount,
    "Series A Investment - Test"
  );
  console.log("   ✅ Investment completed");

  const startupBalance = await mockUSDC.balanceOf(startup1.address);
  console.log("   📊 Startup Balance:", hre.ethers.formatUnits(startupBalance, 6), "USDC");

  // Step 7: Deposit Returns
  console.log("\n7️⃣  VC Depositing 20,000 USDC Returns...");
  const returnsAmount = hre.ethers.parseUnits("20000", 6);
  
  // Transfer USDC to VC for returns
  await mockUSDC.transfer(vcManager.address, returnsAmount);
  await mockUSDC.connect(vcManager).approve(fundAddress, returnsAmount);
  await fund.connect(vcManager).depositReturns(returnsAmount);
  console.log("   ✅ Returns deposited");

  const totalReturns = await fund.totalReturns();
  console.log("   📊 Total Returns:", hre.ethers.formatUnits(totalReturns, 6), "USDC");

  // Step 8: Distribute Returns
  console.log("\n8️⃣  Distributing Returns...");
  const vcBalanceBefore = await mockUSDC.balanceOf(vcManager.address);
  await fund.connect(vcManager).distributeReturns();
  const vcBalanceAfter = await mockUSDC.balanceOf(vcManager.address);
  const vcCarry = vcBalanceAfter - vcBalanceBefore;
  
  console.log("   ✅ Returns distributed");
  console.log("   📊 VC Carry Received:", hre.ethers.formatUnits(vcCarry, 6), "USDC");
  
  // Calculate expected carry
  // Profits = 20,000 - 15,000 = 5,000
  // VC Carry (20%) = 1,000 USDC
  console.log("   💡 Expected VC Carry: 1,000 USDC (20% of 5,000 profit)");

  // Step 9: Get Fund Stats
  console.log("\n9️⃣  Fund Statistics:");
  const stats = await fund.getFundStats();
  console.log("   📊 Total Deposited:", hre.ethers.formatUnits(stats[0], 6), "USDC");
  console.log("   📊 Total Invested:", hre.ethers.formatUnits(stats[1], 6), "USDC");
  console.log("   📊 Total Returns:", hre.ethers.formatUnits(stats[2], 6), "USDC");
  console.log("   📊 Contract Balance:", hre.ethers.formatUnits(stats[3], 6), "USDC");
  console.log("   📊 LP Token Supply:", hre.ethers.formatUnits(stats[4], 18));
  console.log("   📊 Fund Active:", stats[5]);

  // Step 10: LP1 Withdraws
  console.log("\n🔟 LP1 Withdrawing half of LP tokens...");
  const FundToken = await hre.ethers.getContractFactory("FundToken");
  const lpToken = FundToken.attach(lpTokenAddress);
  
  const lp1TokenBalance = await lpToken.balanceOf(lp1.address);
  const withdrawAmount = lp1TokenBalance / 2n;
  
  const lp1UsdcBefore = await mockUSDC.balanceOf(lp1.address);
  await fund.connect(lp1).lpWithdraw(withdrawAmount);
  const lp1UsdcAfter = await mockUSDC.balanceOf(lp1.address);
  const lp1Received = lp1UsdcAfter - lp1UsdcBefore;
  
  console.log("   ✅ LP1 withdrawal completed");
  console.log("   📊 LP1 Received:", hre.ethers.formatUnits(lp1Received, 6), "USDC");

  console.log("\n✅ Complete Test Flow Successful! 🎉");
  console.log("\n📋 Summary:");
  console.log("  - Fund Created:", fundAddress);
  console.log("  - LP Token:", lpTokenAddress);
  console.log("  - MockUSDC:", mockUSDCAddress);
  console.log("  - FundFactory:", fundFactoryAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

