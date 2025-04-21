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

// app.post('/scrape', async (req, res) => {
//     const url = req.body.url;
//     console.log(`Received URL: ${url}`);

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//                 'Accept-Language': 'en-US,en;q=0.9',
//                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//                 'Connection': 'keep-alive'
//             }
//         });

//         const html = response.data;
//         const $ = cheerio.load(html);

//         // Save the full HTML for debugging
//         const filePath = path.join(__dirname, 'scraped_page.html');
//         fs.writeFileSync(filePath, html, 'utf-8');
//         console.log(`Full HTML saved to: ${filePath}`);

//         // Try extracting product image and other info from JSON-LD
//         const jsonLdRaw = $('script[type="application/ld+json"]').html();
//         const jsonLd = JSON.parse(jsonLdRaw);

//         // Extract packet size from Highlights section
//         let packetSize = '';
//         $('.sc-gEvEer.TpdeP').each(function () {
//             if ($(this).text().trim() === 'Pack Size') {
//                 packetSize = $(this).parent().next().find('.sc-gEvEer').text().trim();
//             }
//         });

//         const product = {
//             title: $('[data-testid="item-name"]').text().trim() || jsonLd.name || '',
//             price: $('[data-testid="item-price"]').text().trim() || (jsonLd.offers?.price?.toString() ?? ''),
//             strikedPrice: $('[data-testid="item-striked-price"]').text().trim(),
//             packetSize: packetSize || 'N/A',
//             imageUrl: Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image || ''
//         };

//         console.log(`Scraped product: ${JSON.stringify(product)}`);
//         res.json({ product });
//     } catch (error) {
//         console.error('Error occurred while fetching product data:', error);
//         res.status(500).json({ error: 'An error occurred while fetching the product data.' });
//     }
// });


// app.post('/scrape', async (req, res) => {
//     const url = req.body.url;
//     console.log(`Received URL: ${url}`);

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//                 'Accept-Language': 'en-US,en;q=0.9',
//                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//                 'Connection': 'keep-alive'
//             }
//         });

//         const html = response.data;
//         const $ = cheerio.load(html);
//     ]
//         $('img').each(function() {
//             console.log('Image data-src or src:', $(this).attr('data-src') || $(this).attr('src'));
//         });
        
//         const product = {
//             title: $('[data-testid="item-name"]').text().trim(),
//             price: $('[data-testid="item-price"]').text().trim(),
//             strikedPrice: $('[data-testid="item-striked-price"]').text().trim(),
//             packetSize: $('[class*="kYaBqd"], [data-testid="item-size"]').text().trim(),  // fallback
//             imageUrl: $('img[alt*="' + $('[data-testid="item-name"]').text().trim() + '"]').attr('src') ||  // dynamically use title for alt
//                       $('div[data-testid="image-card-div"] img').attr('src') || 
//                       $('img.sc-gEvEer').attr('src') || 
//                       $('img').first().attr('src') || ''
//         };
        
//         console.log(`Scraped product: ${JSON.stringify(product)}`);
//         res.json({ product });
//     } catch (error) {
//         console.error('Error occurred while fetching product data:', error);
//         res.status(500).json({ error: 'An error occurred while fetching the product data.' });
//     }
// });


// const fs = require('fs');
// const path = require('path');

// app.post('/scrape', async (req, res) => {
//     const url = req.body.url;
//     console.log(`Received URL: ${url}`);

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//                 'Accept-Language': 'en-US,en;q=0.9',
//                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//                 'Connection': 'keep-alive'
//             }
//         });

//         const html = response.data;
//         const $ = cheerio.load(html);

//         // Save HTML
//         const filePath = path.join(__dirname, 'scraped_page1.html');
//         fs.writeFileSync(filePath, html, 'utf-8');

//         // Get JSON-LD
//         const jsonLdRaw = $('script[type="application/ld+json"]').first().html();
//         const jsonLd = JSON.parse(jsonLdRaw);

//         // Extract highlights by section title
//         const getHighlightValue = (label) => {
//             let value = '';
//             $('.sc-gEvEer.TpdeP').each(function () {
//                 if ($(this).text().trim().toLowerCase() === label.toLowerCase()) {
//                     value = $(this).parent().next().find('.sc-gEvEer').text().trim();
//                 }
//             });
//             return value;
//         };

//         // Ingredients
//         const ingredients = [];
//         $('[data-testid="product-highlights-container"] li').each(function () {
//             const text = $(this).text().trim();
//             if (text && text.toLowerCase().includes('milk')) { // crude filter
//                 ingredients.push(text);
//             }
//         });

//         // Nutrition
//         const nutrition = [];
//         $('[data-testid="product-highlights-container"] li').each(function () {
//             const text = $(this).text().trim();
//             if (text && text.match(/(kcal|fat|protein|carb|sugar)/i)) {
//                 nutrition.push(text);
//             }
//         });

//         // Storage Instructions
//         const storage = [];
//         $('[data-testid="product-highlights-container"] li').each(function () {
//             const text = $(this).text().trim();
//             if (text.toLowerCase().includes('freezer') || text.toLowerCase().includes('store')) {
//                 storage.push(text);
//             }
//         });

//         const product = {
//             title: $('[data-testid="item-name"]').text().trim() || jsonLd.name || '',
//             price: $('[data-testid="item-price"]').text().trim() || (jsonLd.offers?.price?.toString() ?? ''),
//             strikedPrice: $('[data-testid="item-striked-price"]').text().trim(),
//             packetSize: getHighlightValue('Pack Size') || 'N/A',
//             flavour: getHighlightValue('Flavour') || '',
//             imageUrl: Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image || '',
//             brand: jsonLd.brand?.name || '',
//             description: $('meta[name="description"]').attr('content') || '',
//             ingredients,
//             nutrition,
//             storageInstructions: storage
//         };

//         console.log('Final scraped product:\n', product);
//         res.json({ product });

//     } catch (error) {
//         console.error('Scraping error:', error.stack || error.message);
//         res.status(500).json({ error: 'Failed to scrape Myntra product data.' });
//     }
    
// });




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




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});