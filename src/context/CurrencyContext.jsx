import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const CurrencyContext = createContext();

const FALLBACK_RATES = { INR: 1, USD: 0.012, EUR: 0.011 };
const SYMBOLS = { INR: '₹', USD: '$', EUR: '€' };
const LOCALES = { INR: 'en-IN', USD: 'en-US', EUR: 'en-IE' };

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => localStorage.getItem('ht_currency') || 'INR');
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [paygButtons, setPaygButtons] = useState({ inrPbId: '', usdPbId: '', eurPbId: '' });

  useEffect(() => {
    let alive = true;
    api.getConfig()
      .then(({ data }) => {
        if (!alive || !data) return;
        if (data.rates) setRates({ ...FALLBACK_RATES, ...data.rates });
        if (data.payglocal) setPaygButtons(data.payglocal);
      })
      .catch(() => { /* silent — fall back */ });
    return () => { alive = false; };
  }, []);

  const setCurrency = (c) => {
    setCurrencyState(c);
    localStorage.setItem('ht_currency', c);
  };

  const convert = (priceInr) => {
    const rate = rates[currency] ?? 1;
    return Math.round(Number(priceInr || 0) * rate * 100) / 100;
  };

  const format = (priceInr) => {
    const value = convert(priceInr);
    try {
      return new Intl.NumberFormat(LOCALES[currency] || 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'INR' ? 0 : 2,
      }).format(value);
    } catch (_) {
      return `${SYMBOLS[currency] || ''}${value}`;
    }
  };

  const value = useMemo(
    () => ({ currency, setCurrency, rates, paygButtons, convert, format, symbols: SYMBOLS }),
    [currency, rates, paygButtons]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
