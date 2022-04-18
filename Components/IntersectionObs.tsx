import React, {
  Fragment,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'

interface IntersectionObsProps {
  children: ReactElement | ReactElement[]
  height?: number
  width?: number
  threshold?: number
  removeOnIntersect?: boolean
}

const IntersectionObs = ({ children, ...props }: IntersectionObsProps) => {
  if (Array.isArray(children)) {
    return (
      <Fragment>
        {children.map((child, i) => (
          <IntersectionSingle key={i} {...props}>
            {child}
          </IntersectionSingle>
        ))}
      </Fragment>
    )
  } else {
    return <IntersectionSingle {...props}>{children}</IntersectionSingle>
  }
}

export default IntersectionObs

interface IntersectionSingleProps extends IntersectionObsProps {
  children: ReactElement
}

const IntersectionSingle = ({
  children,
  height = 0,
  width = 0,
  removeOnIntersect = false,
  threshold = 0,
}: IntersectionSingleProps) => {
  const childrenRef = useRef<HTMLDivElement>(null)
  const [childrenShown, setChildrenShown] = useState(false)

  const [childHeight, setChildHeight] = useState(height)

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChildrenShown(true)
          removeOnIntersect && intersectionObserver.unobserve(entry.target)
        } else {
          setChildrenShown(false)
        }
      },
      {
        threshold,
      }
    )

    if (childrenRef.current) {
      intersectionObserver.observe(childrenRef.current)
    }

    return () => {
      intersectionObserver.disconnect()
    }
  }, [])

  // prevents scrollbar from jumping by using the element's height when it's known
  useEffect(() => {
    setChildHeight(childrenRef.current?.clientHeight || height)
  }, [childrenShown])

  return (
    <div
      style={childrenShown ? {} : { minHeight: childHeight, minWidth: width }}
      ref={childrenRef}
    >
      {childrenShown && children}
    </div>
  )
}
