// In Memory Database (or Temporary Database)

type PageLink = {
    id: string;
    title: string;
    page_url: string;
    date: Date;
};

let pageLinks: PageLink[] = [];

export const getPageLinks = () => pageLinks;

export const addPageLink = (pageLink: PageLink) => {
    pageLinks.push(pageLink);
};

export const deletePageLink = (id: string) => {
    pageLinks = pageLinks.filter((pageLink) => pageLink.id !== id);
};

export const updatePageLink = (id: string, title: string, page_url: string) => {
    const pageLink = pageLinks.find((pageLink) => pageLink.id === id);
    
    if (pageLink) {
        pageLink.title = title;
        pageLink.page_url = page_url;
    } else {
        throw new Error("No Link Found");
    }
};

export const getPageLinkById = (id: string) => {
    return pageLinks.find((pageLink) => pageLink.id === id);
};
