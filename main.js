const invoice = require("./invoices.json");
const plays = require("./plays.json");

function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances;
  return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, invoice, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits \n`;
  return result;

  function totalAmount() {
    let result = 0;
    for (let perf of data.performances) {
      // 注文の内訳を出力
      result += amountFor(perf);
    }
    return result;
  }

  function totalVolumeCredits() {
    let volumeCredits = 0;
    for (let perf of data.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("ue-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDifits: 2,
    }).format(aNumber / 100);
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" == playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
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
}

const result = statement(invoice, plays);
console.log(result);
