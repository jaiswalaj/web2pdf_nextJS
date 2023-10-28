import puppeteer from 'puppeteer';
import fs from 'fs';


export const mergePDF = async (pdfNameList: string[], page_url: string) => {
    const { PDFDocument } = require('pdf-lib');
    
    const regex = /[^a-zA-Z0-9\s]/g;
    const clean_url = page_url.replace(regex, '');

    const min = 1000000; 
    const max = 9999999; 
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const timestampInSeconds = Math.floor(new Date().getTime() / 1000); 
    const fileName = `webpage-combined_${clean_url}_${timestampInSeconds}_${randomNum}.pdf`
    const combinedPDFFilePath = `./lib/${fileName}`;

    const combinedPDF = await PDFDocument.create();

    for (const [index, pdfFilePath] of pdfNameList.entries()) {
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        const pages = await combinedPDF.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page: string) => combinedPDF.addPage(page));
    }

    const pdfBytes = await combinedPDF.save();
    fs.writeFileSync(combinedPDFFilePath, pdfBytes);

    return fileName
}


export const removeDuplicates = (arr: string[]) => {
    const uniqueSet = new Set<string>();
    for (const item of arr) {
        uniqueSet.add(item);
    }
    const uniqueArray = Array.from(uniqueSet);
    return uniqueArray;
}


export const getSubLinks = async (page_url: string) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(page_url);

        const links = await page.evaluate(() => {
            const anchorElements = document.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
            const links: string[] = [];
          
            anchorElements.forEach((element) => {
              const href = element.getAttribute('href');
              if (href && href[0] === "/") {
                links.push(href);
              }
            });
          
            return links;
        });

        return links
    } catch (error) {
        console.log("Error: ", error)
    }
}


export const getCompleteSubLinks = (arr: string[], page_url: string): string[] => {
    if (page_url.slice(-1) === '/') {
      page_url = page_url.slice(0, -1);
    }
  
    const completeLinks: string[] = arr.map((subLink) => `${page_url}${subLink}`);
  
    return completeLinks;
  };
  

export const convertWebToPdf = async (page_url: string) => {
    const regex = /[^a-zA-Z0-9\s]/g;
    const clean_url = page_url.replace(regex, '');

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(page_url);

        const pdfBuffer = await page.pdf();

        const timestampInSeconds = Math.floor(new Date().getTime() / 1000); 
        const pdfFilePath = `./lib/webpage_${clean_url}_${timestampInSeconds}.pdf`

        fs.writeFileSync(pdfFilePath, pdfBuffer);

        browser.close()
        return pdfFilePath
    } catch (error) {
        console.log("Error: ", error)
    }
}


export const deleteFiles = (filePaths: string[]) => {
    for (const filePath of filePaths) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Error deleting file ${filePath}: ${error}`);
      }
    }
  }