import express from "express"
import data from "./data.js"
import cors from "cors"
import axios from "axios"
import jsdom from "jsdom"
import dotenv from "dotenv"
import mongoose from "mongoose"
import expressAsyncHandler from "express-async-handler"
import seedRouter from './seedRoutes.js';
import userRouter from './userRoutes.js';

dotenv.config()
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

  const app= express()
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors())
  
  app.use('/api/seed', seedRouter);
  app.use('/api/users', userRouter);
  app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
  });


const getHTML = async (URL) => {
  try {
    return await axios.get(URL)
  } catch (error) {
    console.error(error)
  }
}
const getItem = async (link, tags )=>{
  try {
    var htmlLink = await getHTML(link)
    if(htmlLink){
      return new Promise((resolve, reject) => { 
        var domx = new jsdom.JSDOM(htmlLink.data)
        var elem =  domx.window.document.querySelectorAll(tags)
        elem.forEach(function(item) {
          // console.log('fn=', item.textContent);
          resolve(item);
            })
        })
    }
  } catch (error) {
    console.log(error);
  }
}
const getItemFromTable = async(link, tags, index )=>{
 try {
  var htmlLink = await getHTML(link)
  if(htmlLink){
    return new Promise((resolve, reject) => { 
      var domx = new jsdom.JSDOM(htmlLink.data)
      var elem =  domx.window.document.querySelectorAll(tags)
        resolve(elem[index]);
      })
  }
 } catch (error) {
   console.log(error);
 }
}


app.get('/api/test', async (req, res)=>{
  var data = {}
  data['products']=[]
  const html = await getHTML('https://www.mytek.tn/informatique/ordinateurs-portables/pc-portable.html?p=3')
  const dom = new jsdom.JSDOM(html.data);
  //get images from url  
  var elemImg =  dom.window.document.querySelectorAll(".product-image-wrapper img"); 
  var images=[]
  elemImg.forEach(function(item) {
      images.push(item.src)
  });
  
  // var nbProducts = parseInt(dom.window.document.querySelector(".toolbar-number").textContent)
  var product={}
  var _id=0
  var elemLink =  dom.window.document.querySelectorAll(".product-item-link");
  elemLink.forEach(async (item)=> {
    var link = item.href
    if(link.length>0){
      let name= await getItem(link, ".page-title span")
      name = name ?  name.textContent : 'not mentioned'
      let slug= await getItem(link, ".sku .value ")
      slug = slug ?  slug.textContent : 'not mentioned'
      let price= await getItem(link, ".product-info-main .price-box .price")
      price = price ?  price.textContent : 'not mentioned'
      let brand= await getItem(link, ".amshopby-option-link img")
      brand = brand ?  brand.title : 'not mentioned'
      let stock= await getItem(link, ".available span")
      stock = stock ?  stock.textContent : 'not mentioned'
      let description= await getItem(link, ".value p")
      description = description ?  description.textContent : 'not mentioned'
      let ram = await getItemFromTable(link, ".data td", 2)
      ram = ram ?  ram.textContent : 'not mentioned'
      let os = await getItemFromTable(link, ".data td", 5)
      os = os ?  os.textContent : 'not mentioned'
      let CPU = await getItemFromTable(link, ".data td", 1)
      CPU = CPU ?  CPU.textContent : 'not mentioned'
      let screen = await getItemFromTable(link, ".data td", 6)
      screen = screen ?  screen.textContent : 'not mentioned'
      let disk = await getItemFromTable(link, ".data td", 7)
      disk = disk ?  disk.textContent : 'not mentioned'
      product ={
        _id :_id ,
        name: name,
        slug: slug,
        category: 'Laptops',
        image: images[_id],//await getItem(link, ".fotorama__loaded--img img").src, // 679px × 829px
        price: price,
        countInStock: 10,
        stock : stock ,
        brand: brand,
        rating: 4,
        nbRating: 168 ,
        description: description,
        ram : ram,
        os	: os,
        CPU : CPU,
        screen : screen,
        disk : disk,
        link : link,
      }
        data.products.push(product)
        _id++      
        // console.log('data=', data);
  }
  });    
})

app.get('/api/products', (req, res)=>{
    res.send(data.products)
})
app.get('/api/product/slug/:slug', (req, res)=>{
    const product =  data.products.find(x=> x.slug == req.params.slug)
    if(product){
        res.send(product)
    }else{
        res.status(404).send({message: "Product NOT FOUND"})
    }
})

app.get('/api/products/:id', (req, res) => {
    const product = data.products.find((x) => {
        return x._id == req.params.id ?  x :  null
    });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  });


const port= process.env.PORT || 5000 

app.listen(port, ()=>{
    console.log(`serve at ${port}`);
})