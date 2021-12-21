import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getTvDetail, IMovie } from "../../api";
import { makeImagePath } from "../../utils";
import noImg from "../../images/no_image.png";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  padding: 15px;
  position: relative;
  top: -90px;
  font-size: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  top: -120px;
  position: relative;
  padding: 0px 15px;
  width: 100%;
  margin-top: 40px;
`;

const DetailItem = styled.div`
  font-size: 18px;
  display: flex;
  margin: 2px 5px;
  color: ${(props) => props.theme.white.lighter};
`;

const Genre = styled.div`
  margin-top: 25px;
`;

const GenreDetail = styled.span`
  color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  padding: 0px 6px;
  margin: 0px 3px;
  background-color: ${(props) => props.theme.white.darker};
`;
function Detail() {
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const TvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { data, isLoading } = useQuery<IMovie>(["detail"], () =>
    bigMovieMatch?.params.movieId
      ? getMovieDetail(bigMovieMatch?.params.movieId)
      : getTvDetail(TvMatch?.params.tvId as string)
  );

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <BigCover
            style={{
              backgroundImage: data?.backdrop_path
                ? `linear-gradient(to top, black, transparent), url(${makeImagePath(
                    data.backdrop_path,
                    "w500"
                  )})`
                : noImg,
            }}
          />
          <BigTitle>
            {data?.title} || {data?.name}
          </BigTitle>

          <BigOverview>{data?.overview}</BigOverview>
          <DetailWrapper>
            <DetailItem>Runtime: {data?.runtime}min</DetailItem>
            <DetailItem>Rating: {data?.vote_average}</DetailItem>
            <Genre>
              {data?.genres.map((genre) => (
                <GenreDetail>{genre.name}</GenreDetail>
              ))}
            </Genre>
          </DetailWrapper>
        </>
      )}
    </>
  );
}

export default Detail;
