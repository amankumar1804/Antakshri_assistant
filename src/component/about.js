import { Component } from "react";


class About extends Component{
    render(){ 
        return <>
        {/* <Navbar /> */}
        <div className="darkContainer h-100 d-flex flex-column justify-content-center align-items-center text-center">
                
                <h1 className="pt-3 text-danger ">About Website</h1>
                <div className="col-10">
                        <h6>In this era of internet and social media, we have forgotten traditional
                        games like antakshari. Antakshari can be seen as a game with lots of
                        interactions. This game is connected with our traditions.</h6>
                        <h6>
                        Our way of addressing this problem is to combine today’s technology to
                        rejuvenate the forgotten game.One way of achieving this goal is to build
                        a platform to assist throughout antakshari game. This would make the
                        game more flexible for players as players don’t have to be in the same
                        geographical location to play antakshari.</h6>
                </div>

               <div className="col-12 text-ceneter">
                <h1 className="pt-3 ps-4 text-danger">About Developers</h1>
                </div>
                <div className="mt-2 ">
                    <h4>Krishan Kant Mehra (19JE0450)</h4>
                    <h4>Ankit Kumar (19JE0141)</h4>
                </div>
        
        <br/>
        <a href="/">
            <button className="btnPrimary btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                            BACK
            </button></a>

            </div>
        </>
    }
}

export default About    