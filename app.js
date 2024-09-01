const express = require("express");
const app = express();
const port = 3000;
const { Web3 } = require("web3");
const contractInfo = require("./constants.json");

const address = "0x2B8D583Ff6E54Db4ca0a15a04314eB6D8EaA16C6";
const privateKey =
  "0x2607097cacd162f23b4b5c7e7ef14e4063c229519ba03835030db9b45492d348";
const rpc =
  "https://super-duper-space-xylophone-x59jvj9579543p96q-9650.app.github.dev/ext/bc/lucas/rpc";

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
    to: req.body.receiver,
    value: lucasNet.utils.toWei(String(req.body.amount), "ether"),
  };
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
