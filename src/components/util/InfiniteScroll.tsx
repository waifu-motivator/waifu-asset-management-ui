import React, {FC, useEffect, useRef, useState} from 'react';

interface Props {
  loadMore: (pageNumber: number) => void;
  hasMore: boolean;
  loadMoreDisplay: JSX.Element;
}

const InfiniteScroll: FC<Props> = ({
                                     children,
                                     hasMore,
                                     loadMoreDisplay,
                                     loadMore
                                   }) => {
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement | null>(null);

  const handleObserver = (entities: any[]) => {
    const target = entities[0];
    if (target.isIntersecting) {
      loadMore(page + 1)
      setPage(prevState => prevState + 1)
    }
  }


  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current)
    }
  }, []);


  return (
    <>
      {children}
      <div ref={loader}>
        {hasMore && loadMoreDisplay}
      </div>
    </>
  )
}

export default InfiniteScroll;
