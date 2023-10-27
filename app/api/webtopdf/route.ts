import { NextResponse } from "next/server"
import {mergePDF, removeDuplicates, getSubLinks, getCompleteSubLinks, convertWebToPdf, deleteFiles} from "./utils"


export const POST = async (req: Request, res: Response) => {
    const { page_url } = await req.json();
    try {
        const subLinks: string[] = (await getSubLinks(page_url))?.filter(Boolean) || [];
        const completeLinks = getCompleteSubLinks(subLinks, page_url)
        completeLinks.push(page_url)
        const uniqueSubLinks = removeDuplicates(completeLinks)

        const pdfFilePathPromises = uniqueSubLinks.map(async (link) => {
            const pdfFilePath = await convertWebToPdf(link);
            if (pdfFilePath) {
              return pdfFilePath;
            } else {
              console.error(`Error generating PDF for link: ${link}`);
              return "";
            }
        });

        const pdfFilePaths = await Promise.all(pdfFilePathPromises);
        const validPdfFilePaths = pdfFilePaths.filter((pdfFilePath) => pdfFilePath !== "");
       
        if (validPdfFilePaths.length > 0) {
            const combinedPDFFilePath = await mergePDF(validPdfFilePaths, page_url)
        }

        deleteFiles(validPdfFilePaths)

        return NextResponse.json({message: "OK", validPdfFilePaths}, {status: 201})
        
    } catch (error) {
        return NextResponse.json(
            { message: "Error", error }, 
            { status: 500, }
        ) 
    }
}