import fs from "fs";
import createStatementData from "./createStatementData.js";

const invoice = JSON.parse(fs.readFileSync("./invoices.json", "utf-8"));
const plays = JSON.parse(fs.readFileSync("./plays.json", "utf-8"));

function statement(invoice, plays) {
  const statementData = createStatementData(invoice, plays);
  return renderPlainText(statementData);
}

function htmlStatement(invoice, plays) {
  const statementData = createStatementData(invoice, plays);
  return renderHtml(statementData);
}

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits \n`;
  return result;
}

function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("ue-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDifits: 2,
  }).format(aNumber / 100);
}
const result = statement(invoice, plays);
// const result = htmlStatement(invoice, plays);
console.log(result);
