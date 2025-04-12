## Inspiration

We wanted to make it easier for students to discover colleges, without getting lost in outdated websites, buried links, or PDFs that haven’t been updated since dial-up internet. CollegeConnect exists to bring all that chaos into one gloriously simple, actually-usable app.

## What it does

CollegeConnect lets students input their academic stats and hunt for colleges they might want to go to, without having to open 17 browser tabs or decipher mysterious Excel spreadsheets. You can filter, paginate, and pretend you have your life together with a UI that looks like it belongs in this century.

## How we built it

- **Frontend:** Next.js with React, TypeScript, and Tailwind because we enjoy pain  
- **Backend:** College Scorecard API from the Department of Education (surprisingly usable, 10/10, would fetch again)  
- **Routing & Pagination:** Next.js dynamic routing with URL-based query params because we enjoy watching ourselves suffer

## Challenges we ran into

- Deleted a dependency file and triggered a full-on crisis. Ended up reinstalling everything and migrating the whole codebase like nomads. It was... a time.
- Next.js components not playing nice and routes being a cryptic mess made for a thrilling debugging experience.  
- TypeScript. Do we need to say more?

## Accomplishments that we're proud of

- Somehow created a clean, modern UI that people didn’t recoil from  
- Managed to get filtering and pagination working *with* dynamic urls (take that, query strings)  
- Maintained sanity and didn’t rage quit—arguably our greatest technical feat  

## What we learned

- TypeScript errors are like mini-puzzles... that slowly destroy your will to live  
- How to wrangle shadcn components into doing what we want (eventually)  
- Next.js pagination, routing, and query params are like that one group project member who insists they’re helping but just cause problems  
- That deleting `node_modules` is the tech equivalent of a summoning ritual, usually for chaos

## What's next for CollegeConnect

- School-specific admin portals so orgs can actually update their info and we stop getting emails about it  
- Making it not look weird on phones (wild idea, we know)  
- Maybe throw some AI at the problem and let the robots recommend orgs to students, because what could *possibly* go wrong?
