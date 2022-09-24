import React from "react";
import { Badge, Button, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQuery as useRouteQuery } from "../hooks/useQuery";
import axios from "axios";
import * as Icon from "react-bootstrap-icons";
import "../styles/BookDetails.css";
import { LinkContainer } from "react-router-bootstrap";
import Loading from "./Loading";
import { toast } from "react-toastify";
export default function BookDetails(props) {
  const query = useRouteQuery();
  let { bookId } = useParams();
  const queryClient = useQueryClient();
  if (!bookId) {
    bookId = query.get("bookId");
  }

  const { data, isLoading, isError } = useQuery(
    [bookId],
    async () => axios.get("/book/" + bookId),
    {
      enabled: !!bookId,
    }
  );

  const { mutate } = useMutation(
    async (id) => axios.patch("/book/release", { bookId: id }),
    {
      onSuccess: () => {
        if (data.status === 200) {
          toast.success("Book released successfully");
          queryClient.invalidateQueries("exchange-token-count");
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    }
  );

  const book = data?.data?.data;

  if (isLoading) return <Loading />;
  if (isError || !book) return <div>Something went wrong!</div>;
  return (
    <Container fluid className="my-4">
      <Row>
        <Col
          xs={4}
          className={
            "border d-flex justify-content-center align-items-center p-3"
          }
        >
          <Image
            src={process.env.REACT_APP_BASE_API + book?.cover}
            className="img-fluid w-75 rounded shadow"
          />
        </Col>
        <Col className="border p-3">
          <h5 className="text-muted">About the book</h5>
          <hr />
          <Row>
            <Col className="p-0">
              <h2>{book?.title} </h2>
            </Col>
            <Col className="d-flex gap-2 justify-content-end">
              <Button variant="bg-none shadow-none wishlistButton ">
                <Icon.Heart />
                {/* <Icon.HeartFill /> */}
                <br />
                Wishlist
              </Button>
            </Col>
          </Row>
          <small className="text-muted">By {book?.author}</small>
          <h4>Rs. {book?.price}</h4>
          <p>Published on {book?.publishedDate}</p>
          {book?.genre?.map((g) => (
            <Badge key={g._id}>{g.name}</Badge>
          ))}

          <p className="text-muted">
            Owned by <b>{book?.owner.fullName}</b>
          </p>
          <p>{book?.description}</p>

          {!props.viewOnly && (
            <p className="d-flex gap-2">
              {!book?.isMine && (
                <>
                  {book?.isHeldByMe ? (
                    <Button variant="danger" onClick={() => mutate(book?._id)}>
                      Release book
                    </Button>
                  ) : (
                    <LinkContainer to={`/exchange?bookId=${book?._id}`}>
                      <Button>Get</Button>
                    </LinkContainer>
                  )}
                  <Button variant="outline-success">Buy</Button>
                </>
              )}
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
