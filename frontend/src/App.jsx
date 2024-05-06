import RightPanel from "./components/common/RightPanel.jsx";
import Sidebar from "./components/common/SideBar.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx"
import HomePage from "./pages/home/HomePage.jsx";

import { Routes, Route } from "react-router-dom";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc no need to be routed */}
			<Sidebar /> 
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage />} />
				<Route path='/profile/:username' element={<ProfilePage />} />
				
			</Routes>
			<RightPanel/>
		</div>
	);
}

export default App