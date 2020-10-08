const invoice = require("./invoices.json");
const plays = require("./plays.json");

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  function format(aNumber) {
    return new Intl.NumberFormat("ue-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDifits: 2,
    }).format(aNumber);
  }

  // 問合せによる一時変数の置き換え
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // ボリュームポイントの計算
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" == playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unkwon type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  for (let perf of invoice.performances) {
    // ボリューム特典のポイントを加算
    volumeCredits += volumeCreditsFor(perf);

    // 注文の内訳を出力
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += amountFor(perf);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

const result = statement(invoice, plays);
console.log(result);
