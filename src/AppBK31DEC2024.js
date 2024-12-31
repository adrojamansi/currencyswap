import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  FormHelperText, 
  CircularProgress, 
  Button, 
  Box 
} from '@mui/material';
import './App.css';

// Helper function to fetch token prices
const fetchTokenPrices = async () => {
  try {
    const response = await axios.get('https://interview.switcheo.com/prices.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return [];
  }
};

function App() {
  const [tokenPrices, setTokenPrices] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPrices = async () => {
      const prices = await fetchTokenPrices();          
      setTokenPrices(prices);
      setLoading(false);
    };
    getPrices();
  }, []);

  const handleConversion = () => {
    if (amount <= 0 || !fromCurrency || !toCurrency) {
      setConvertedAmount('');
      return;
    }

    const fromToken = tokenPrices.find((token) => token.currency === fromCurrency);
    const toToken = tokenPrices.find((token) => token.currency === toCurrency);

    if (fromToken && toToken) {
      const fromPrice = fromToken.price;
      const toPrice = toToken.price;

      const converted = (amount * fromPrice) / toPrice;
      setConvertedAmount(converted.toFixed(2));
      setError('');
    } else {
      setConvertedAmount('Price not available');
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount greater than 0');
    } else {
      setError('');
    }
    setAmount(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConversion();
  };

  const getTokenImageUrl = (tokenSymbol) => {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${tokenSymbol}.svg`;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
      <Card 
        sx={{ 
          width: 400, 
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', 
          borderRadius: '16px', 
          backgroundColor: '#fff'
        }}
      >
        <CardContent>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center" 
            sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '8px 0',
              backgroundColor: '#1976d2', 
              color: '#fff',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            Currency Swap
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <FormControl fullWidth variant="outlined" error={Boolean(error)}>
                  <InputLabel htmlFor="fromCurrency">From Currency</InputLabel>
                  <Select
                    id="fromCurrency"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    label="From Currency"
                    required
                  >
                    <MenuItem value="">
                      <em>Select Currency</em>
                    </MenuItem>
                    {tokenPrices.map((token) => (
                      <MenuItem key={token.currency} value={token.currency}>
                        <img
                          src={getTokenImageUrl(token.currency)}
                          alt={`${token.currency} icon`}
                          style={{ width: '20px', marginRight: '8px' }}
                        />
                        {token.currency}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
              </Box>

              <Box mb={3}>
                <Typography variant="body1" component="label" htmlFor="amount" sx={{ display: 'block', mb: 1 }}>
                  Amount
                </Typography>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount to swap"
                  min="0.01"
                  step="0.01"
                  required
                  style={{
                    width: '100%', 
                    padding: '10px', 
                    fontSize: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '10px',
                  }}
                />
                {error && <span className="error-message" style={{ color: 'red', fontSize: '14px' }}>{error}</span>}
              </Box>

              <Box mb={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="toCurrency">To Currency</InputLabel>
                  <Select
                    id="toCurrency"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    label="To Currency"
                    required
                  >
                    <MenuItem value="">
                      <em>Select Currency</em>
                    </MenuItem>
                    {tokenPrices.map((token) => (
                      <MenuItem key={token.currency} value={token.currency}>
                        <img
                          src={getTokenImageUrl(token.currency)}
                          alt={`${token.currency} icon`}
                          style={{ width: '20px', marginRight: '8px' }}
                        />
                        {token.currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box mb={3}>
                <Typography variant="body1" component="label" htmlFor="convertedAmount" sx={{ display: 'block', mb: 1 }}>
                  Converted Amount
                </Typography>
                <input
                  type="text"
                  id="convertedAmount"
                  value={convertedAmount}
                  disabled
                  placeholder="Amount will appear here"
                  style={{
                    width: '100%', 
                    padding: '10px', 
                    fontSize: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': { 
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#1565c0',
                  }
                }}
              >
                Swap
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
