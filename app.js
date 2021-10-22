const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv/config");
const api = process.env.API_URL;

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

const productSchema = mongoose.Schema({
  product_name: String,
  product_discription: String,
  product_Quantity: Number,
  user: String,
});
const Product = mongoose.model("Product", productSchema);

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    product_name: req.body.product_name,
    product_discription: req.body.product_discription,
    product_Quantity: req.body.product_Quantity,
    user: req.body.user,
  });
  product
    .save()
    .then((createProduct) => {
      res.status(201).json(createProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

app.put(`${api}/products/:id`, async (req, res) => {
  const productList = await Product.findByIdAndUpdate({
    product_name: req.body.product_name,
    product_discription: req.body.product_discription,
    product_Quantity: req.body.product_Quantity,
    user: req.body.user,
  });
  if (!productList) {
    res.status(400).send("the product canot be created");
  }
  res.send(productList);
});

app.delete(`${api}/products/:id`, (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((item) => {
      if (item) {
        res
          .status(200)
          .json({ success: true, mesage: "Successfully  deleted" });
      } else {
        return res.status(404).json({
          success: false,
          message: "product not found",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Fampay_api",
  })
  .then(() => {
    console.log("DB connect");
  })
  .catch(() => {
    console.log("error");
  });

app.listen(3000, () => {
  console.log("Server is running at 3000 ");
});
