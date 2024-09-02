const express = require("express");
const app = express();
const port = 3000;
const { Web3 } = require("web3");
const contractInfo = require("./constants.json");

const address = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
const privateKey =
  "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
const rpc =
  "https://psychic-telegram-px57g75gg7536vvj-9650.app.github.dev/ext/bc/devChain/rpc";


app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
})




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
  console.log(req.body);
  const tx = {
    from: account[0].address,
    to: req.body.pubKey,
    value: lucasNet.utils.toWei(String(req.body.numESM), "ether"),
  };
  console.log(tx);
  const txReceipt = await lucasNet.eth.sendTransaction(tx);
  console.log("Tx hash:", txReceipt.transactionHash);
  console.log(txReceipt.transactionHash);
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

app.post("/transfer", async (req, res) => {
  const data = req.body;
  const lucasNet = new Web3(rpc);
  const account = lucasNet.eth.accounts.wallet.add(privateKey);
  let diamonds = new lucasNet.eth.Contract(
    contractInfo.abi,
    contractInfo.address
  );
  const tx = {
    from: account[0].address,
    to: data.receiver,
    value: data.emeralds,
  };
  //   const gasEmeralds = await lucasNet.eth.estimateGas(tx);
  const txReceipt = await lucasNet.eth.sendTransaction(tx);
  const transferDiamond = await diamonds.methods
    .transfer(data.receiver, data.diamonds)
    .send({
      from: account[0].address,
    });
  //   const gasDiamond = await diamonds.methods
  //     .transfer(data.receiver, data.diamonds)
  //     .estimateGas();
  res.send({
    message: "Ok",
    statusCode: 200,
    txHashDiamond: transferDiamond.transactionHash,
    txHashEmeralds: txReceipt.transactionHash,
    // gasDiamond: Number(gasDiamond),
    // gasEmeralds: Number(gasEmeralds),
  });
});

//0.9465
// 0.000...1

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
