const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

const fs = require('fs');
const path = require('path');



app.post('/scrape', async (req, res) => {
    const url = req.body.url;
    console.log(`Received URL: ${url}`);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Connection': 'keep-alive'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // const product = {
        //     title: $('span.VU-ZEz').text().trim(),
        //     imageUrl: $('img.DByuf4').attr('src'),
        //     // Try multiple different selectors for price
        //     price: $('div.Nx9bqj.CxhGGd.yKS4la').text().trim() || 
        //            $('div.hl05eU div.Nx9bqj').text().trim() ||
        //            $('div.yKS4la:contains("$")').text().trim(),
        //     deliveryInfo: $('div.yiggsN').text().trim(),
        // };

        //better
        // const product = {
        //     title: $('span.VU-ZEz').text().trim(),
        //     imageUrl: $('img.DByuf4').attr('src'),
        //     // Price: Trying different selectors to get the price
        //     price: $('div.Nx9bqj.CxhGGd.yKS4la').text().trim() || 
        //            $('div.hl05eU div.Nx9bqj').text().trim() ||
        //            $('div.yKS4la:contains("₹")').text().trim(),
        //     // Extracting Rating and Reviews separately
        //     rating: $('span.Wphh3N span span:first-child').text().trim().replace(' Ratings', ''), // Ratings count
        //     reviews: $('span.Wphh3N span span:last-child').text().trim().replace(' Reviews', ''), // Reviews count
        //     deliveryInfo: $('div.yiggsN').text().trim(),
        //     // Available Offers
        //     availableOffers: $('.f+WmCe .NYb6Oz .I+EQVr span.kF1Ml8').map((i, el) => {
        //         const offerTitle = $(el).find('.ynXjOy').text().trim();
        //         const offerDetails = $(el).find('span').not('.ynXjOy').text().trim();
        //         return { offerTitle, offerDetails };
        //     }).get(),
        // };

        
        const product = {
            title: $('span.VU-ZEz').text().trim(),
            imageUrl: $('img.DByuf4').attr('src'),
            price: $('div.Nx9bqj.CxhGGd.yKS4la').text().trim() || 
                   $('div.hl05eU div.Nx9bqj').text().trim() ||
                   $('div.yKS4la:contains("₹")').text().trim(),
            rating: $('span.Wphh3N span span:first-child').text().trim().replace(' Ratings', ''),
            reviews: $('span.Wphh3N span span:last-child').text().trim().replace(' Reviews', ''),
            deliveryInfo: $('div.yiggsN').text().trim(),
            availableOffers: $('.f+WmCe .NYb6Oz .I+EQVr span.kF1Ml8').map((i, el) => {
                const offerTitle = $(el).find('.ynXjOy').text().trim();
                const offerDetails = $(el).find('span').not('.ynXjOy').text().trim();
                return { offerTitle, offerDetails };
            }).get(),
            sellerName: $('#sellerName span span').first().text().trim(),  // Extracting the seller name
        };

        console.log(`Scraped product: ${JSON.stringify(product)}`);
        res.json({ product });
    } catch (error) {
        console.error('Error occurred while fetching product data:', error);
        res.status(500).json({ error: 'An error occurred while fetching the product data.' });
    }
});



app.post('/urls', async (req, res) => {
    const url = req.body.url;
    console.log(`Received URL: ${url}`);

    try {
        // Make the request to the provided URL
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Connection': 'keep-alive'
            }
        });

        // Load the HTML into cheerio for parsing
        const html = response.data;
        const $ = cheerio.load(html);

        // Extracting product URLs from a specific class
        const productUrls = [];

        // Modify this selector based on your page's structure
        $('.product-item-class a').each((index, element) => {
            const productUrl = $(element).attr('href');  // Extract the href attribute (URL)
            if (productUrl) {
                // Make sure to handle relative URLs by prepending the base URL if needed
                const fullProductUrl = productUrl.startsWith('http') ? productUrl : `https://www.example.com${productUrl}`;
                productUrls.push(fullProductUrl);
            }
        });

        // Output the extracted product URLs
        console.log(`Extracted Product URLs: ${JSON.stringify(productUrls)}`);

        // Send back the product URLs as a JSON response
        res.json({ productUrls });
    } catch (error) {
        console.error('Error occurred while fetching product URLs:', error);
        res.status(500).json({ error: 'An error occurred while fetching the product URLs.' });
    }
});


const BASE_URL = 'https://www.flipkart.com';

app.post('/scrape-products', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Flipkart listing URL is required.' });

    try {
        const html = (await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        })).data;

        const $ = cheerio.load(html);
        const productLinks = [];

        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith('/')) {
                if (href.includes('/p/')) {
                    const fullUrl = BASE_URL + href.split('?')[0]; // Clean URL
                    if (!productLinks.includes(fullUrl)) {
                        productLinks.push(fullUrl);
                    }
                }
            }
        });

        const top5Links = productLinks.slice(0, 5);

        const scrapedData = [];

        for (const productUrl of top5Links) {
            try {
                const response = await axios.post('http://localhost:3000/scrape', { url: productUrl });
                scrapedData.push(response.data.product);
            } catch (err) {
                scrapedData.push({ error: `Failed to scrape ${productUrl}` });
            }
        }

        res.json({ count: scrapedData.length, products: scrapedData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong while scraping listing page.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});