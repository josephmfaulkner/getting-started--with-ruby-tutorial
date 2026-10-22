import { Fragment } from "react"
import { pluralize } from "../lib/format"

// Star picker made of radio buttons (styled by .rating in application.css)
export default function RatingInput({ name, defaultValue }: { name: string; defaultValue?: number }) {
  return (
    <fieldset>
      <legend>Rating</legend>
      <div className="rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <Fragment key={i}>
            <input type="radio" name={name} id={`rating_${i}`} value={i} required className="sr-only" defaultChecked={defaultValue === i} />
            <label htmlFor={`rating_${i}`}>
              <span aria-hidden="true">★</span>
              <span className="sr-only">{pluralize(i, "star")}</span>
            </label>
          </Fragment>
        ))}
      </div>
    </fieldset>
  )
}
