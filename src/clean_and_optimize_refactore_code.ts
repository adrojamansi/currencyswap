interface WalletBalance {
    blockchain: string;
    currency: string;
    amount: number;
  }
  
  interface FormattedWalletBalance extends WalletBalance {
    formatted: string;  // Represents the formatted balance amount
  }
  
  interface Props extends BoxProps {}
  
  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    
    // Custom hooks that retrieve wallet balances and price information
    const balances = useWalletBalances();
    const prices = usePrices();
  
    // A mapping object to assign priority to different blockchains
    const blockchainPriorityMap: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
  
    // Function to retrieve the priority of a blockchain, using the map defined above.
    // If the blockchain is not found in the map, it returns a default priority of -99.
    const getPriority = (blockchain: string): number => {
      return blockchainPriorityMap[blockchain] ?? -99; // Default to -99 for unrecognized blockchains
    };
  
    // Memoize the filtering, sorting, and formatting logic to prevent unnecessary recomputations
    const sortedBalances = useMemo(() => {
      return balances
        // Filter out balances with non-positive amounts and blockchains with low priority (-99)
        .filter((balance: WalletBalance) => balance.amount > 0 && getPriority(balance.blockchain) > -99)
        
        // Sort balances by blockchain priority (highest first)
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const lhsPriority = getPriority(lhs.blockchain);
          const rhsPriority = getPriority(rhs.blockchain);
          return rhsPriority - lhsPriority;  // Sort in descending order of priority
        })
        
        // Format the balance amounts after sorting, to display them with two decimal places
        .map((balance: WalletBalance) => ({
          ...balance,           // Copy the original balance data
          formatted: balance.amount.toFixed(2), // Format the balance amount as a string with two decimal places
        }));
    }, [balances]); // Dependencies: Recompute when 'balances' changes.
  
    // Memoize the row generation logic for displaying the balances, to prevent unnecessary re-renders
    const rows = useMemo(() => {
      return sortedBalances.map((balance: FormattedWalletBalance) => {
        // Calculate the USD value of each balance by multiplying it with the price from the 'prices' object
        const usdValue = prices[balance.currency] * balance.amount;
  
        return (
          <WalletRow
            className={classes.row}  // Apply styles to the row
            key={`${balance.currency}-${balance.blockchain}`}  // Use a unique combination of currency and blockchain for the key
            amount={balance.amount}  // Pass the raw amount to the WalletRow
            usdValue={usdValue}      // Pass the calculated USD value to the WalletRow
            formattedAmount={balance.formatted}  // Pass the formatted amount to the WalletRow
          />
        );
      });
    }, [sortedBalances, prices]); // Dependencies: Recompute when 'sortedBalances' or 'prices' changes.
  
    return (
      <div {...rest}>
        {rows}  {/* Render the rows (WalletRow components) for each balance */}
      </div>
    );
  };