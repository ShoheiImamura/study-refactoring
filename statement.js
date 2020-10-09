import fs from "fs";
import createStatementData from "./createStatementData.js";

const invoice = JSON.parse(fs.readFileSync("./invoices.json", "utf-8"));
const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"));

function statement(invoice, plays) {
  const statementData = createStatementData(invoice, plays);
  return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, invoice, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits \n`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat("ue-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDifits: 2,
    }).format(aNumber / 100);
  }
}

const result = statement(invoice, plays);
console.log(result);
