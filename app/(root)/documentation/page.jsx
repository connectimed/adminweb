import React from "react";

const page = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">📘 Trading Bot Documentation</h1>
      <p className="mb-8">
        This guide explains how our automated trading bot works and how you can
        use the dashboard to configure and control it. The bot connects to your
        Binance account and executes trades automatically based on your defined
        parameters.
      </p>

      {/* How It Works */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">⚙️ How the Bot Works</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            The bot connects securely to Binance using your API Key and Secret.
          </li>
          <li>
            It checks the market price for your selected trading pair (e.g.,
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
              BTCUSDT
            </code>
            ) at regular intervals.
          </li>
          <li>
            If the price falls below your <strong>Buy Below</strong> value, the
            bot will place a market <strong>BUY</strong> order.
          </li>
          <li>
            If the price rises above your <strong>Sell Above</strong> value, the
            bot will place a market <strong>SELL</strong> order.
          </li>
          <li>
            All executed trades are logged in the <strong>Trade History</strong>{" "}
            section of the dashboard.
          </li>
        </ul>
      </section>

      {/* Key Features */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">✨ Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Automated buying and selling based on your rules.</li>
          <li>Real-time Binance price monitoring.</li>
          <li>Secure API key storage using Firebase.</li>
          <li>Full trade history tracking with timestamps and prices.</li>
          <li>Start, pause, and update settings anytime from the dashboard.</li>
        </ul>
      </section>

      {/* Dashboard Guide */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🖥 Using the Dashboard</h2>
        <ol className="list-decimal list-inside space-y-3">
          <li>
            Go to the <strong>Bot Settings</strong> page.
          </li>
          <li>
            Select your trading pair (e.g., <code>BTCUSDT</code>).
          </li>
          <li>
            Set your <strong>Buy Below</strong> price (the maximum price you
            want to buy at).
          </li>
          <li>
            Set your <strong>Sell Above</strong> price (the minimum price you
            want to sell at).
          </li>
          <li>
            Enter the <strong>Trade Amount</strong> you want for each order.
          </li>
          <li>
            Set the bot status to <strong>Running</strong> to start trading, or{" "}
            <strong>Paused</strong> to stop.
          </li>
          <li>Click “Save” to apply your settings.</li>
        </ol>
      </section>

      {/* Tips & Warnings */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">⚠️ Tips & Warnings</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Only trade with amounts you can afford to risk — crypto prices are
            volatile.
          </li>
          <li>
            Make sure your Binance API keys have trading permissions enabled.
          </li>
          <li>
            Do <strong>not</strong> share your API keys with anyone.
          </li>
          <li>
            Regularly monitor the bot’s trade history to ensure it’s working as
            expected.
          </li>
        </ul>
      </section>

      {/* Support */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📩 Need Help?</h2>
        <p>If you have any issues or questions, contact the developer.</p>
      </section>
    </div>
  );
};

export default page;
