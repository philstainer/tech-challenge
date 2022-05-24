import { useState } from "react";
import { useQuery } from "react-query";

const fetchEvents = async ({queryKey}) => {
  const data = await fetch(`api/events?sortField=${queryKey[1]}`);

  const json = data.json();

  console.log(data, json);
  return json;
};

const columns = ["Type", "Description", "Name", "Domain"];

function App() {
  const [sortField, setSortField] = useState("seedId");

  const { isLoading, isError, error, data } = useQuery(
    ["repoData", sortField],
    fetchEvents
  );

  const handleSortChange = (e) => setSortField(e.target.value);

  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    data?.events && (
      <div className="App">
        <h5>Sort By</h5>
        <div>
          <label htmlFor="seedSortField">Seed Id</label>
          <input
            id="seedSortField"
            type="radio"
            value="seedId"
            name="sortField"
            onChange={handleSortChange}
            defaultChecked={sortField === "seedId"}
          />
        </div>
        <br />
        <div>
          <label htmlFor="dateSSortField">Created Date Time</label>
          <input
            id="dateSSortField"
            type="radio"
            value="createdDateTime"
            name="sortField"
            onChange={handleSortChange}
            defaultChecked={sortField === "createdDateTime"}
          />
        </div>
        <br />
        <h5>Resutls</h5>
        {data.events.length} events found!
        <table className="table-auto">
          <thead className="border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.events.map((event) => (
              <tr key={event.id} className='border-b'>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.type}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{event.description}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{event.seed.name}</td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{event.seed.domain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default App;
