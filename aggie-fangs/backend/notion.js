const { Client } = require("@notionhq/client")

const NOTION_API_KEY = 'secret_AFKZAuWeh8KSRFU7dK4vcdUTEQG1pb3CyQtwBIdj9Ws'
feedbackID = '22f238cc864e4a1496e42e3d8a2c05c6'
codeProbId ='6874305ce7a84e0b812f48cc649e8dd9'
leetCodeId ='3cb9e25839cd4ab2abe7d189b46575d2'
hackerRankId ='0698bdf32713495586b8a33be98bf48e'
otherUrlId ='056f97d0a08240eaa197b4bcc97f2263'
//email type: email
NOTION_EMAIL_ID = 'S%3AUR'
//name type: rich text
NOTION_NAME_ID = 'Tqov'
//tag type: multi_select
NOTION_TAG_ID = '%5C~%7Cf'
//down votes type: number
NOTION_DVOTES_ID = 'g~OQ'
//description type: rich text
NOTION_DESCRIPTION_ID = 'h%5Da%3E'
//up votes type: number
NOTION_UPVOTES_ID = 'k_Eb'
//title type: title
NOTION_TITLE_ID = 'title'

const notion = new Client({ auth:  NOTION_API_KEY })

async function getTags() {
  const database = await notion.databases.retrieve({
    database_id:  feedbackID,
  })
  var prop = database.properties
  var idProp = notionPropertiesById(prop)
  var items = idProp[NOTION_TAG_ID].multi_select
  var sorted = items.options.map(tag => {
      return{
        id: tag.id,
        name: tag.name
      }
  })
 // console.log("my tags are->",sorted)
  return(sorted)

  /* return notionPropertiesById(database.properties)[NOTION_TAG_ID].multi_select.options.map(option => {
    return { id: option.id, name: option.name }
  }) */
}

function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property
    return { ...obj, [id]: rest }
  }, {})
}

async function addReview({ title, description, userEmail, name, tag}) {
  notion.pages.create({
    parent: {
      database_id: feedbackID,
    },
    properties: {
        'Company Name': {
          title: [
            {
              type: "text",
              text: {
                content:title,
              },
            },
          ],
        },
        'S%3AUR': {
          email : userEmail
        },
        'Tqov': {
          rich_text: [
            {
              type: "text",
              text: {
                content: name,
              },
            },
          ],
        },
        'h%5Da%3E': {
          rich_text: [
            {
              type: "text",
              text: {
                content: description,
              },
            },
          ],
        },
        'g~OQ': {
          number: 0,
        },
        'k_Eb': {
          number: 0,
        },
        '%5C~%7Cf': {
          multi_select: [
            {
              id: tag
            }
          ],
        },
        
    }



  })
}

function addCodeProb({company, concepts, probTitle, probPrompt}) {
  notion.pages.create({
    parent: {
      database_id: codeProbId,
    },
    properties: {
        'Company Name': {
          title: [
            {
              type: "text",
              text: {
                content:company,
              },
            },
          ],
        },
        'Tqov': {
          rich_text: [
            {
              type: "text",
              text: {
                content: concepts,
              },
            },
          ],
        },
        'efwD': {
          rich_text: [
            {
              type: "text",
              text: {
                content: probPrompt,
              },
            },
          ],
        },
        'h%5Da%3E': {
          rich_text: [
            {
              type: "text",
              text: {
                content: probTitle,
              },
            },
          ],
        },

        
    }



  })
}

function addLeetcodeURL({company, probTitle, url}) {
  notion.pages.create({
    parent: {
      database_id: leetCodeId,
    },
    properties: {
        'Company Name': {
          title: [
            {
              type: "text",
              text: {
                content:company,
              },
            },
          ],
        },
        'h%5Da%3E': {
          rich_text: [
            {
              type: "text",
              text: {
                content: probTitle,
              },
            },
          ],
        },
        'OXwE': {
            url: url
          }
        }
      
  })
}

function addHackerRankURL({company, probTitle, url}) {
  //console.log("in notion recieved: ", company, probTitle, url)
  notion.pages.create({
    parent: {
      database_id: hackerRankId,
    },
    properties: {
        'title': {
          title: [
            {
              type: "text",
              text: {
                content: company,
              },
            },
          ],
        },
        'h%5Da%3E': {
          rich_text: [
            {
              type: "text",
              text: {
                content: probTitle,
              },
            },
          ],
        },
        'OXwE': {
            url: url
          }
        }
      
  })
}

function addOtherURL({company, probTitle, url}) {
  //console.log("in notion recieved: ", company, probTitle, url)
  console.log("in notion.js")
  notion.pages.create({
    parent: {
      database_id: otherUrlId,
    },
    properties: {
        'title': {
          title: [
            {
              type: "text",
              text: {
                content: company,
              },
            },
          ],
        },
        'h%5Da%3E': {
          rich_text: [
            {
              type: "text",
              text: {
                content: probTitle,
              },
            },
          ],
        },
        'OXwE': {
            url: url
          }
        }
      
  })
}

async function getReviews() {
    const response = await notion.databases.query({
        database_id:  feedbackID,
        sorts: [{ property: NOTION_UPVOTES_ID , direction: "descending" }],
      })
  return response.results.map(feedbackObj)
}

async function getURLS(db) {
  const response = await notion.databases.query({
      database_id: db,
    })
return response.results.map(urlObj)
}

async function getCodeProbs() {
  const response = await notion.databases.query({
      database_id: codeProbId,

    })
return response.results.map(codeProbObj)
}

function feedbackObj(notionPage) {
  const propertiesById = notionPropertiesById(notionPage.properties)

  return {
    id: notionPage.id,
    title: propertiesById[ NOTION_TITLE_ID].title[0].plain_text,
    upVotes: propertiesById[ NOTION_UPVOTES_ID].number,
    downVotes: propertiesById[ NOTION_DVOTES_ID].number,
    name: propertiesById[NOTION_NAME_ID].rich_text[0].text.content,
    tags: propertiesById[ NOTION_TAG_ID].multi_select[0].name,
    description:
      propertiesById[ NOTION_DESCRIPTION_ID].rich_text[0].text
        .content,
    email: propertiesById[NOTION_EMAIL_ID].email,
  }
}

function urlObj(notionPage) {
  const propertiesById = notionPropertiesById(notionPage.properties)
  return {
    id: notionPage.id,
    title: propertiesById['title'].title[0].plain_text,
    name: propertiesById['h%5Da%3E'].rich_text[0].text.content,
    url: propertiesById['OXwE'].url,
  }
}

function codeProbObj(notionPage) {
  const propertiesById = notionPropertiesById(notionPage.properties)
  return {
    id: notionPage.id,
    company: propertiesById['title'].title[0].plain_text,
    title: propertiesById['h%5Da%3E'].rich_text[0].text.content,
    prompt: propertiesById['efwD'].rich_text[0].text.content,
    concepts: propertiesById['Tqov'].rich_text[0].text.content,
  }
}

async function upVoteReview(pageId) {
  const suggestion = await getReview(pageId)
  const votes = suggestion.upVotes + 1
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [ NOTION_UPVOTES_ID]: { number: votes },
    },
  })

  return votes
}

async function downVoteReview(pageId) {
  const suggestion = await getReview(pageId)
  const votes = suggestion.downVotes - 1
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [ NOTION_DVOTES_ID]: { number: votes },
    },
  })

  return votes
}

async function getReview(pageId) {
  return feedbackObj(await notion.pages.retrieve({ page_id: pageId}))
}

module.exports = {
  addReview,
  getTags,
  getReviews,
  upVoteReview,
  addCodeProb,
  downVoteReview,
  getReview,
  addLeetcodeURL,
  getURLS,
  getCodeProbs,
  addHackerRankURL,
  addOtherURL,
  
}