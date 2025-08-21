# PackageTracking

# Versions

Backend:  
- Framework: ASP.NET Core 8  
- API: RESTful Web API  
- Database: Entity Framework Core (In-Memory Database)  
- Utilities: AutoMapper  

Frontend:  
- Framework: React 18  
- Language: TypeScript  
- Styling: Tailwind CSS  
- Routing: React Router  
- API Communication: Axios  

# To run code

Pull or clone git repository. You will see 2 directories PackageTrackingApi for backend and package-tracking-frontend for frontend. Open 2 terminals and in first go to ~/PackageTracking/PackageTrackingApi run ```dotnet run``` and in second terminal go to ~/PackageTracking/package-tracking-frontend and run two commands: ```npm install``` and after installation ```npm start```. Web page should open by itself.

# Features

Create Packages: Easily add new packages with sender and recipient information.  
Track Status: Follow a package's journey through a clear, state-managed system (Created -> Sent -> Accepted/Returned/Canceled).  
Detailed View: View complete package details, including an elegant timeline of its status history.  
Status Management: Update a package's status with actions that are only available based on enforced transition rules.  
Dynamic Filtering: Quickly find packages by filtering the list by status or searching by tracking number.  
Responsive UI: A clean and modern user interface that works seamlessly on desktop and mobile devices.  
