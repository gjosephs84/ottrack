import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            Home Page
            <Link to="create-offering">Create Offering</Link>
        </div>
    );
}

export default Home;