const express = require("express");
const app = express();
const { Web3 } = require("web3");
const contractInfo = require("./constants.json");

const address = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
const privateKey = "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
const rpc = "https://psychic-telegram-px57g75gg7536vvj-9650.app.github.dev/ext/bc/devChain/rpc";

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hola Bogotá!");
});

app.get("/contract-info", async (req, res) => {
  const lucasNet = new Web3(rpc);
  const balanceLucas = await lucasNet.eth.getBalance(address);
  console.log({ balanceLucas });
  res.send({
    message: "Hola Bogotá...!",
    balanceLucas: Number(balanceLucas) / 10 ** 18,
  });
});

app.post("/transfer-native-token", async (req, res) => {
  const lucasNet = new Web3(rpc);
  const account = lucasNet.eth.accounts.wallet.add(privateKey);
  const tx = {
    from: account[0].address,
    to: req.body.pubKey,
    value: lucasNet.utils.toWei(String(req.body.numESM), "ether"),
  };
  const txReceipt = await lucasNet.eth.sendTransaction(tx);
  console.log("Tx hash:", txReceipt.transactionHash);
  res.send({
    message: "Ok",
    statusCode: 200,
    txHash: txReceipt.transactionHash,
  });
});

app.post("/tranfer-diamond", async (req, res) => {
  const data = req.body;
  const lucasNet = new Web3(rpc);
  const account = lucasNet.eth.accounts.wallet.add(privateKey);
  let diamonds = new lucasNet.eth.Contract(
    contractInfo.abi,
    contractInfo.address
  );
  const transferDiamond = await diamonds.methods
    .transfer(data.receiver, data.amount)
    .send({
      from: account[0].address,
    });

  res.send({
    message: "Ok",
    statusCode: 200,
    txHash: transferDiamond.transactionHash,
  });
});


// Exporta la aplicación para Vercel
module.exports = app;
