export const generatePageTag = (range: [number, number], page: "next" | "prev", pt?: string) => {
  if (!pt) return `p1:${range[0]}-${range[1]}`
  if (page === "next") {
    const nextPage = getNextPage(pt);
    return `${pt}|${nextPage}:${range[0]}-${range[1]}`
  } else {
    const lastPageTag = getLastPageTag(pt)
    return pt.substring(0, pt.length - lastPageTag.length)
  }
}

const getLastPageTag = (pt: string): string => {
  const pageTags = pt.split("|")
  return pageTags[pageTags.length - 1];
}

const getNextPage = (pt: string) => {
  const lastPageTag = getLastPageTag(pt)
  const lastPage = lastPageTag.split(":")[0]
  const lastPageNo = Number(lastPage.substring(1));
  return `p${lastPageNo + 1}`
}

export const getLastEndId = (pt: string): number => {
  if (!pt) return 0;
  const lastPageTag = getLastPageTag(pt)
  const pageRangeString = lastPageTag.split(":")[1]
  const range = pageRangeString.split("-");
  const rangNo = range.map(r => Number(r));
  return rangNo[1]
}

export const getPreviousPageRang = (pt: string): [number, number] => {
  if (!pt) return null;
  const pageTags = pt.split("|")
  const lastPageTag = pageTags[pageTags.length - 2];
  // const lastPageTag = getLastPageTag(pt)
  const pageRangeString = lastPageTag.split(":")[1]
  const range = pageRangeString.split("-");
  const rangNo = range.map(r => Number(r));
  return [rangNo[0], rangNo[1]]
}

//page tag validation

// pt: {
//   in: ["query"],
//   isString: true,
//   matches: {
//     options: /^p\d+:\d+-\d+(?:\|p\d+:\d+-\d+)*$/, errorMessage: "Invalid page tag"
//   },
//   optional: true
// }

