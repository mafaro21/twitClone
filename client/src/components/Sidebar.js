import '../css/Sidebar.css';
import '../css/custom.scss';


function Sidebar() {
    return (
        <div className="col-sm-4 p-3 ">
            <div className="p-3 sidebar">
                <h5>Trending Topics</h5>
                <p>dfdsafdsafd</p>
            </div>
            <div className="p-3 mt-4 sidebar">
                <h5>People You May Know</h5>
                <p>dfdsafdsafd</p>
            </div>
            <div className="p-3 mt-4  sticky ">
                <div className="footer row">
                    <div className="col">
                        <p>About</p>
                        <p>Terms Of Service</p>
                    </div>
                    <div className="col">
                        <p>© TwitClone 2021</p>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Sidebar;