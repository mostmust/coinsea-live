// netlify/functions/binance-leaderboard.js

const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const res = await axios.post(
      'https://www.binance.com/bapi/futures/v1/public/future/leaderboard/getLeaderboardRank',
      {
        tradeType: 'PERPETUAL',
        periodType: 'WEEKLY',      // 또는 DAILY, MONTHLY
        statisticsType: 'ROI',     // 또는 PNL
        isShared: true,
        limit: 30
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(res.data.data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch Binance leaderboard', error: error.message })
    };
  }
};
