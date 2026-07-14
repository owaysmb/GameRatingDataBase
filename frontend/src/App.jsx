import { useState } from 'react'
import './App.css'
import { NavbarButton } from "./Components/HomePage/Navbar";
import { Filters } from "./Components/HomePage/Filters"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { GameDetails } from './Components/GameDetailsPage/GameDetails';
import { TopRated } from './Components/HomePage/TopRated';
import { ScrollToTop } from './Components/ScrollToTop';
import { TrendingGames } from './Components/HomePage/TrendingGames';
import { UpcomingGames } from './Components/HomePage/UpcomingGames';
import { RecentlyReleasedGames } from './Components/HomePage/RecentlyReleasedGames';
import { Loading } from './Components/Loading';
import { Login } from './Components/LoginPage/Login';
import { Signup } from './Components/LoginPage/Signup';
import { ProfilePage } from './Components/Profile/ProfilePage';
import { AuthProvider } from "../context/AuthContext";
import { ProfileStatsPage } from './Components/Profile/ProfileStatsPage/ProfileStatsPage';
import { TopRatedPage } from '../src/Components/HomePage/NavBarPages/TopRatedPage';
import { NewReleasedPage } from './Components/HomePage/NavBarPages/NewRealesedPage';
import { TrendingPage } from './Components/HomePage/NavBarPages/TrendingPage';
import {UpcomingPage} from '../src/Components/HomePage/NavBarPages/UpcomingPage'
import { ForumMainPage } from './Components/GameForum/ForumMainPage';
import { CreatePost } from "../src/Components/GameForum/CreatePost";
import { ProfileEdit } from './Components/Profile/ProfileEdit';
import { ProfileSettings } from './Components/Profile/ProfileSettings';


function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter> 
        <ScrollToTop/>
        
          <NavbarButton/>
          <Loading/>
          <Routes>
            <Route path='/' element={
                <>
                  {/* <Filters />  */}
                  <RecentlyReleasedGames/>
                  <TopRated/>
                  <TrendingGames/>
                  <UpcomingGames/>
                </>
            }>
            </Route>

            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path="/game/:id" element={<GameDetails />} /> {/* route this Component whenever the game:id is shown */}
            <Route path='/profile' element={<ProfilePage/>} />
            <Route path='/profile/edit' element={<ProfileEdit/>}/>
            <Route path='/profile/settings' element={<ProfileSettings/>}/>
            <Route path='/profile/stats' element={<ProfileStatsPage/>}/>
            <Route path='/top-rated-page' element={<TopRatedPage/>}/>
            <Route path='/new-released-page' element={<NewReleasedPage/>}/>
            <Route path='/trending-page' element={<TrendingPage/>}/>
            <Route path='/Upcoming-page' element={<UpcomingPage/>}/>
            
          </Routes>
          
          <Routes>
            <Route path='/game/:id/forum' element={<ForumMainPage/>}/>
            <Route path="/game/:id/forum/create-post" element={<CreatePost />} />
          </Routes>
            
        </BrowserRouter>
    </AuthProvider>
        
    </>
  )
}

export default App
