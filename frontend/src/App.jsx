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
function App() {

  return (
    <>
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
          </Routes>
          
            
        </BrowserRouter>
    </>
  )
}

export default App
