import React from 'react';
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import Sidebar from '../components/Sidebar';
import tobias from '../images/tobias-reich.jpg';
import derick from '../images/derick-anies.jpg';


function Home() {
    return (
        <div className="App general ">
            <div className="container ">
                <h3 className="text-start">Welcome, $Username</h3>
                <div className="row pt-4">
                    <br />
                    <div className="col main-view ">
                        <div className="p-2 view row">             {/* <--- standard tweet*/}
                            <div className="col-sm-1">              {/* <--- user avi */}
                                <img src={derick} alt="example" className="user-logo" />
                            </div>
                            <div className="col">                   {/* <--- user content */}
                                <div className="user-content">
                                    first user  <span>@firstuser69</span>
                                </div>
                                <p>this is my first tweet</p>
                            </div>
                        </div>                                     {/* <--- standard tweet*/}

                        <div className="p-2 view row">
                            <div className="col-sm-1 ">
                                <img src={derick} alt="example" className="user-logo" />
                            </div>
                            <div className="col">
                                <div className="user-content">
                                    first user <span> @firstuser69</span>
                                </div>
                                <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>
                            </div>
                        </div>

                        <div className="p-2 view">
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </p>
                        </div>

                        <div className="p-2 view">
                            <p>
                                <img src={tobias} alt="test" className="tweet-img" />
                            </p>
                        </div>
                    </div>

                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

export default Home;

//<h1>Welcome</h1>
