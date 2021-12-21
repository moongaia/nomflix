import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getAiringToday,
  getMovies,
  getPopular,
  getTopRated,
  getTvOntheAir,
  getTvTopRated,
  getUpcoming,
  IGetMoviesResult,
  IGetTvResult,
  IMovie,
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

const Category = styled.span`
  background: linear-gradient(to top, #ffe400 20%, transparent 20%);
  margin-bottom: 3px;
  font-size: 23px;
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

function Tv() {
  const history = useHistory();
  const TvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  console.log(TvMatch);
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetTvResult>(
    ["tv", "airingToday"],
    getAiringToday
  );

  const { data: onAir, isLoading: airLoading } = useQuery<IGetTvResult>(
    ["tv", "ontheAir"],
    getTvOntheAir // 최신작
  );

  const { data: popular, isLoading: popularLoading } = useQuery<IGetTvResult>(
    ["tv", "popular"],
    getPopular
  );

  const { data: top, isLoading: topLoading } = useQuery<IGetTvResult>(
    ["tv", "top"],
    getTvTopRated
  );

  const [index, setIndex] = useState(0);
  const [latestIndex, setLatestIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [leaving, setLeaving] = useState(false); // Row간격 버그 수정

  const incraseIndex = () => {
    if (onAir) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = onAir.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setLatestIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseTodayIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseTopIndex = () => {
    if (top) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = top.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incrasePopularIndex = () => {
    if (popular) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = popular.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");

  // const clickedTv =
  //   TvMatch?.params.tvId &&
  //   data?.results.find((tv) => tv.id === +TvMatch.params.tvId); // +: String to Number

  // const clickedLatest =
  //   TvMatch?.params.tvId &&
  //   onAir?.results.find((tv) => tv.id === +TvMatch.params.tvId);

  // const clickedPopular =
  //   TvMatch?.params.tvId &&
  //   popular?.results.find((tv) => tv.id === +TvMatch.params.tvId);

  // const clickedTopRated =
  //   TvMatch?.params.tvId &&
  //   top?.results.find((tv) => tv.id === +TvMatch.params.tvId);

  // console.log(latest);
  // console.log(data?.results);

  return (
    <Wrapper>
      {isLoading && airLoading && popularLoading && topLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(onAir?.results[0].backdrop_path || "")}
          >
            <Title>{onAir?.results[0].name}</Title>
            <Overview>{onAir?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <Category>Latest Shows</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={latestIndex}
              >
                {onAir?.results
                  .slice(1)
                  .slice(offset * latestIndex, offset * latestIndex + offset) // pagination
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <NextBtn onClick={incraseIndex}>
              <i className="fas fa-chevron-right"></i>
            </NextBtn>
          </Slider>

          <Slider>
            <Category>Airing Today</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset) // pagination
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <NextBtn onClick={incraseTodayIndex}>
              <i className="fas fa-chevron-right"></i>
            </NextBtn>
          </Slider>

          <Slider>
            <Category>Top Rated</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {top?.results
                  .slice(1)
                  .slice(offset * topIndex, offset * topIndex + offset) // pagination
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <NextBtn onClick={incraseTopIndex}>
              <i className="fas fa-chevron-right"></i>
            </NextBtn>
          </Slider>

          <Slider>
            <Category>Popular</Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popular?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset) // pagination
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
            <NextBtn onClick={incrasePopularIndex}>
              <i className="fas fa-chevron-right"></i>
            </NextBtn>
          </Slider>

          <AnimatePresence>
            {TvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={TvMatch.params.tvId}
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
export default Tv;
