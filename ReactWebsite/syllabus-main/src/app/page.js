/* The Homepage, view locally with npm run dev, delete .next folder locally if not working */
import UploadButton from "@/components/UploadButton"
import CalendarEvent from "@/components/CalendarEvent"
import { getSession,logout } from "@/_utils/lib";
import { redirect } from "next/navigation";
import UserFilesList from "@/components/UserFiles";
import GenerateButton from "@/components/GenerateButton";
import HeaderBar from "@/components/HeaderBar";


export default async function Home() {
  return (
    <>
      <HeaderBar></HeaderBar>
      <p>Please upload a PDF to get started.</p>
      <div>
        <UploadButton />
        <UserFilesList />
        <GenerateButton/>
        <div className="container1">
          <div className="ad-container left-justified">
            <img src="/Ad1.jpg" alt="Ad 1"></img>
            <img src="/Ad2.jpg" alt="Ad 2"></img>
            <img src="/Ad3.jpg" alt="Ad 3"></img>
          </div>
          <CalendarEvent></CalendarEvent>
          <div className="ad-container right-justified">
            <img src="/Ad4.jpg" alt="Ad 4"></img>
            <img src="/Ad5.jpg" alt="Ad 5"></img>
            <img src="/Ad6.jpg" alt="Ad 6"></img>
          </div>
        </div>
      </div>
    </>
  )
}