import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

export function loader() {
  return json({
    flights: [
      { origin: 'ARN', destination: 'EZE' },
      { origin: 'LLA', destination: 'ARN' },
    ],
  });
}

export default function Flights() {
  const data = useLoaderData();

  return (
    <main>
      <h1>Flights</h1>
      <ul>
        {data.flights?.map(flight => (
          <li key={flight.origin + flight.destination}>
            {flight.origin} - {flight.destination}
          </li>
        ))}
      </ul>
      <Link to="/">Go back home</Link>
    </main>
  );
}
