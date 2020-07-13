
# Service for Generating and Route Pages

## Objective

Create service, which will generate new pages from data and templates, save this into a draft or complete page, and deliver these pages to other servers.

## Demo scenario

  

### Servers

-   Back Office Server - localhost:3000
    

	-   Builder (???)
	    

	-   Delivery Server (???)
    
-   Landing Page Server - localhost:4000
    

### Complete page

-   Domain
    
-   URL
    
-   JSON
    
-   Page Html code
    
-   ??? dependencies
    

### URLs

-   Save page
    

	-- localhost:3000 POST /pages/ {...}

-   Publish page
    

	-- localhost:3000 POST /pages/publish {...}

-   Preview page
    

	-- localhost:3000 GET /pages/preview/learn-manual-qa-2020

	-- localhost:3000 GET /pages/preview/learn-devops-2020

-   View page
    

	-- localhost:4000 GET /learn-manual-qa-2020

	-- localhost:4000 GET /learn-devops-2020

  

### Data Store

At the start - Arrays on Back Office Server (TEMP)

1.  draftPages
    
2.  completePages

At the end - Redis
    

## Steps

1.  -> Back office admin creates a new page from template.
    
2.  Back office server requests The Builder to build a complete page from template and JSON data.
    
3.  Builder renders complete page.
    
4.  Back office server saves the complete page. To database??
    
5.  -> Back office admin publishes the complete page.
    
6.  Back office server notifies delivery server about complete page update.
    
7.  Delivery server refreshes the complete page.
    
8.  Website visitor requests the page
    
9.  Delivery server routes request to a specific complete page
    

1.  Split URL to domain and page address
    
2.  Find web site entity by domain name
    
3.  Find complete page by web site and page address
    
4.  Return page html code from complete page
    

11.  -> Delivery server return the fresh page html code
    
12.  Repeat some step to make sure Delivery service properly refreshes the landing page
    

  

## Tasks

1.  Create repository
    
2.  Configure MVP Back Office Server
    
3.  Create mock-json for generating complete pages (???)
    
4.  Create Demo entry point on Back Office Server with button for creating page
    
5.  Create Form for add/edit page
    
6.  Create saving new or editing page drafts (into array draftPages)
    

	* localhost:3000 POST /pages/ {...}
    

8.  Add debounce to previous
    
9.  Create mock-templates page and page-rows
    
10.  Create Builder Service on Back Office Server for decorate incoming data with a template before saving (into draftPages or completePages)
    
11.  Create Publish for adding complete page into completePages
    

		* localhost:3000 POST /pages/publish/{pageUrl}
    

13.  Create List of pages with:
    

		*  Draft -> to edit form (save draft, preview draft, publish complete page)
		    
		*  Preview draft
		    
		*  Complete -> to edit form (save draft, preview draft, publish complete page)
    

15.  Configure MVP Landing Page Server
    
16.  Create request with URL from Landing Page Server to Delivery server
    
17.  Create Delivery Service on Back Office Server which
    

		*  Accept a request
		    
		*  Split URL to domain and page address
		    
		*  Find complete page by domain and page address
		    
		*  Return complete page html code
    

19.  Create Preview Service
    

		*  Build html code into draft if it is not
		    
		*  Route to localhost:3000/pages/preview/{pageUrl}
		    
		*  Get html code from draft (localhost:3000 GET /pages/draft/{pageUrl})
    

21.  Add Redis into Back Office Server
    
22.  Migrate Data Store from array to Redis
    
23.  Create cashing on Delivery Server (???)
    
24.  Create notification Delivery Server about new page or new version page
    

### Test Task:

-   Create two pages to localhost:3000
    

	-   learn-manual-qa-2020
	    
	-   learn-devops-2020
    

-   Check page and html code on
    

	-   localhost:4000/learn-manual-qa-2020
	    
	-   localhost:4000/learn-devops-2020
    

-   Edit first page on localhost:3000 and publish
    
-   Check changes this page on localhost:3000
    

  
  

# Ideas for improvements

-   Have separate draft and published versions of the web page  -- this week
    
-   Showcase the app with a couple of page -- this week
    
-   Have two row templates -- the next week