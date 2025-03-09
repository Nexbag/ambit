"use client";
import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  Time,
  CandlestickSeries,
  DeepPartial,
  ChartOptions,
  CrosshairMode,
} from "lightweight-charts";
import { getRequest } from "@/app/components/js/api_client";
import {
  CryptoWalletResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";

const CandleChart = ({
  wallet,
  user,
  cryptoWalletUrl,
  prices,
}: {
  wallet: CryptoWalletResponseType;
  user: UserResponseType;
  cryptoWalletUrl: string;
  prices: number[][];
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const [pagePrices, setPagePrices] = useState<number[][]>(prices);

  // Initialize the chart only once
  useEffect(() => {
    if (!chartRef.current || chartInstance.current) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: "white",
        background: { type: ColorType.Solid, color: "transparent" },
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },

      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        barSpacing: 15,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
      },
    };

    const chart = createChart(chartRef.current, chartOptions);
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    candleSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.3, bottom: 0.25 },
    });

    chartInstance.current = chart;
    candleSeriesRef.current = candleSeries;
  }, []);

  // Fetch & update the chart every 2 minutes
  useEffect(() => {
    async function fetchData() {
      const { data } = await getRequest(
        `${cryptoWalletUrl}${wallet._id}`,
        user?.token
      );

      if (data) setPagePrices(data.prices);
    }
    const interval = setInterval(() => {
      fetchData();
    }, 2000 * 60);
    return () => clearInterval(interval);
  }, [cryptoWalletUrl, wallet._id, user?.token]);

  // Update chart when pagePrices changes
  useEffect(() => {
    if (!candleSeriesRef.current || !pagePrices.length) return;
    const getMultiplier = (): number => {
      let minPrice = Math.min(...pagePrices.map((e) => e[3])); // Get the lowest price
      let multiplier = 1;

      while (minPrice * multiplier < 0.9) {
        multiplier *= 10;
      }

      return multiplier;
    };

    const multiplier = getMultiplier();

    const values = pagePrices.map((e) => ({
      time: e[0] as Time,
      open: e[1] * multiplier,
      high: e[2] * multiplier,
      low: e[3] * multiplier,
      close: e[4] * multiplier,
    }));

    candleSeriesRef.current.setData(values);
  }, [pagePrices]);

  return (
    <div ref={chartRef} id="chart" style={{ width: "100%", height: "100%" }} />
  );
};

export default CandleChart;
