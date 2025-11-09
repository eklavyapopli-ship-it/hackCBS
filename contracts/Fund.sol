// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./FundToken.sol";

contract Fund is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable vcManager;
    IERC20 public immutable acceptedStablecoin;
    FundToken public immutable lpToken;
    
    uint256 public totalDeposited;
    uint256 public totalInvested;
    uint256 public totalReturns;
    uint256 public carriedInterestPercent;
    bool public fundActive;
    
    mapping(address => uint256) public lpContributions;
    mapping(address => uint256) public investments;
    
    event Deposit(address indexed lp, uint256 amount, uint256 lpTokens);
    event InvestmentMade(address indexed startup, uint256 amount, string description);
    event ReturnsDeposited(uint256 amount);
    event ReturnsDistributed(uint256 lpReturns, uint256 vcCarry);
    event Withdrawal(address indexed lp, uint256 amount, uint256 lpTokensBurned);

    constructor(
        address _stablecoinAddress,
        address _lpTokenAddress,
        uint256 _carriedInterestPercent,
        address _vcManager
    ) {
        require(_stablecoinAddress != address(0), "Invalid stablecoin address");
        require(_lpTokenAddress != address(0), "Invalid LP token address");
        require(_vcManager != address(0), "Invalid VC manager address");
        require(_carriedInterestPercent <= 100, "Carry percent cannot exceed 100");
        
        vcManager = _vcManager;
        acceptedStablecoin = IERC20(_stablecoinAddress);
        lpToken = FundToken(_lpTokenAddress);
        carriedInterestPercent = _carriedInterestPercent;
        fundActive = true;
    }

    function deposit(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(fundActive, "Fund is not active");
        
        acceptedStablecoin.safeTransferFrom(msg.sender, address(this), _amount);
        
        uint256 lpTokensToMint;
        if (totalDeposited == 0) {
            // First deposit: 1:1 ratio
            lpTokensToMint = _amount;
        } else {
            // Calculate LP tokens based on current total supply and total deposited
            uint256 currentLpSupply = lpToken.totalSupply();
            lpTokensToMint = (_amount * currentLpSupply) / totalDeposited;
        }
        
        lpContributions[msg.sender] += _amount;
        totalDeposited += _amount;
        
        lpToken.mint(msg.sender, lpTokensToMint);
        
        emit Deposit(msg.sender, _amount, lpTokensToMint);
    }

    function invest(
        address _startup,
        uint256 _amount,
        string calldata _description
    ) external nonReentrant {
        require(msg.sender == vcManager, "Only VC manager can invest");
        require(_amount > 0, "Amount must be greater than 0");
        require(_startup != address(0), "Invalid startup address");
        require(fundActive, "Fund is not active");
        
        uint256 contractBalance = acceptedStablecoin.balanceOf(address(this));
        require(_amount <= contractBalance, "Insufficient balance");
        
        acceptedStablecoin.safeTransfer(_startup, _amount);
        investments[_startup] += _amount;
        totalInvested += _amount;
        
        emit InvestmentMade(_startup, _amount, _description);
    }

    function depositReturns(uint256 _amount) external nonReentrant {
        require(msg.sender == vcManager, "Only VC manager can deposit returns");
        require(_amount > 0, "Amount must be greater than 0");
        
        acceptedStablecoin.safeTransferFrom(msg.sender, address(this), _amount);
        totalReturns += _amount;
        
        emit ReturnsDeposited(_amount);
    }

    function distributeReturns() external nonReentrant {
        require(msg.sender == vcManager, "Only VC manager can distribute returns");
        require(totalReturns > 0, "No returns to distribute");
        
        uint256 contractBalance = acceptedStablecoin.balanceOf(address(this));
        require(contractBalance >= totalReturns, "Insufficient contract balance");
        
        // Calculate profits (returns minus invested amount)
        uint256 profits = totalReturns > totalInvested ? totalReturns - totalInvested : 0;
        uint256 vcCarry = 0;
        uint256 lpReturns = totalReturns;
        
        // Calculate VC carried interest on profits only
        if (profits > 0 && carriedInterestPercent > 0) {
            vcCarry = (profits * carriedInterestPercent) / 100;
            lpReturns = totalReturns - vcCarry;
        }
        
        // Transfer VC carry to manager
        if (vcCarry > 0) {
            acceptedStablecoin.safeTransfer(vcManager, vcCarry);
        }
        
        // LPs can withdraw their proportional share of the remaining balance
        // (which includes their share of returns) using lpWithdraw function
        // Reset totalReturns tracking after VC carry is extracted
        totalReturns = 0;
        
        emit ReturnsDistributed(lpReturns, vcCarry);
    }

    function lpWithdraw(uint256 _lpTokenAmount) external nonReentrant {
        require(_lpTokenAmount > 0, "Amount must be greater than 0");
        require(totalDeposited > 0, "No deposits available");
        
        uint256 lpTokenBalance = lpToken.balanceOf(msg.sender);
        require(_lpTokenAmount <= lpTokenBalance, "Insufficient LP tokens");
        
        uint256 lpTokenSupply = lpToken.totalSupply();
        require(lpTokenSupply > 0, "No LP tokens in circulation");
        
        uint256 contractBalance = acceptedStablecoin.balanceOf(address(this));
        uint256 userShare = (contractBalance * _lpTokenAmount) / lpTokenSupply;
        
        require(userShare > 0, "Share amount must be greater than 0");
        require(userShare <= contractBalance, "Insufficient contract balance");
        
        // Update state before transfer
        uint256 contributionToReduce = (userShare * totalDeposited) / contractBalance;
        if (contributionToReduce > lpContributions[msg.sender]) {
            contributionToReduce = lpContributions[msg.sender];
        }
        
        lpContributions[msg.sender] -= contributionToReduce;
        totalDeposited -= contributionToReduce;
        
        // Burn LP tokens
        lpToken.burnFrom(msg.sender, _lpTokenAmount);
        
        // Transfer funds
        acceptedStablecoin.safeTransfer(msg.sender, userShare);
        
        emit Withdrawal(msg.sender, userShare, _lpTokenAmount);
    }

    function getFundStats() external view returns (
        uint256 _totalDeposited,
        uint256 _totalInvested,
        uint256 _totalReturns,
        uint256 _contractBalance,
        uint256 _lpTokenSupply,
        bool _fundActive
    ) {
        return (
            totalDeposited,
            totalInvested,
            totalReturns,
            acceptedStablecoin.balanceOf(address(this)),
            lpToken.totalSupply(),
            fundActive
        );
    }

    function getLPShare(address _lp) external view returns (uint256) {
        uint256 lpTokenBalance = lpToken.balanceOf(_lp);
        uint256 lpTokenSupply = lpToken.totalSupply();
        if (lpTokenSupply == 0) return 0;
        
        uint256 contractBalance = acceptedStablecoin.balanceOf(address(this));
        return (contractBalance * lpTokenBalance) / lpTokenSupply;
    }
}

