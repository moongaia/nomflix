import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  IGetMoviesResult,
  IGetTvResult,
  searchMovies,
  searchTvShows,
} from "../api";
import { makeImagePath } from "../utils";
import Detail from "./Components/Detail";

const Wrapper = styled.div`
  background: black;
  font-family: "GowunDodum-Regular";
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin-bottom: 15rem;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center; // 상하 좌우
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Category = styled.div`
  font-size: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const NextBtn = styled(motion.div)`
  position: absolute;
  right: -2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: ${(props) => props.theme.white.lighter};
  cursor: pointer;
  width: 50px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.4);
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5, // + 10은 내부의 gap을 수정해주기 위한 것.
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  console.log(bigTvMatch, bigMovieMatch);
  const { scrollY } = useViewportScroll();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movies, isLoading: movieLoading } = useQuery<IGetMoviesResult>(
    ["movies", keyword],
    async () => keyword && searchMovies(keyword)
  );

  const { data: tvShows, isLoading: tvLoading } = useQuery<IGetTvResult>(
    ["tvShows", keyword],
    async () => keyword && searchTvShows(keyword)
  );

  const [index, setIndex] = useState(0);
  const [tvIndex, setTvIndex] = useState(0);
  const [leaving, setLeaving] = useState(false); // Row간격 버그 수정
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const incraseIndex = () => {
    if (movies) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movies.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseTvIndex = () => {
    if (tvShows) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = tvShows.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onTvBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/");

  // const clickedMovie =
  //   bigMovieMatch?.params.movieId &&
  //   movies?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId); // +: String to Number

  // const clickedTv =
  //   bigTvMatch?.params.tvId &&
  //   tvShows?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);

  return (
    <Wrapper>
      {movieLoading && tvLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(movies?.results[0].backdrop_path || "")}
          >
            <Title>{movies?.results[0].title}</Title>
            <Overview>{movies?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <Category>Movies</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {movies?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset) // pagination
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextBtn onClick={incraseIndex}>
              <i className="fas fa-chevron-right"></i>
            </NextBtn>
          </Slider>

          <Slider>
            <Category>TV Shows</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={tvIndex}
              >
                {tvShows?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset) // pagination
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onTvBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextBtn onClick={incraseTvIndex}>
              <i className="fas fa-chevron-right"></i>
            </NextBtn>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  <Detail />
                </BigMovie>
              </>
            ) : null}
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  <Detail />
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
