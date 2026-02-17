import React from "react";

function SearchSection() {
  return (
    <div className="search-sect">
      <div className="search">
        <Formik
          initialValues={{
            selectDisease: "",
            selectDoctor: "",
            location: "",
          }}
          onSubmit={async (values, actions) => {
            locationHandler(values);
            actions.resetForm();
          }}
        >
          <form>
            <div className="search-form">
              <div className="search-input">
                <label className="search-label" htmlFor="selectDisease">
                  Specialist
                </label>
                <select
                  id="selectDisease"
                  className="selector"
                  onChange={(e) => setSelectDisease(e.currentTarget.value)}
                >
                  {[
                    "Name or disease",
                    "top-center",
                    "top-end",
                    "middle-start",
                    "middle-center",
                    "middle-end",
                    "bottom-start",
                    "bottom-center",
                    "bottom-end",
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-input">
                <label className="search-label" htmlFor="selectDoctor">
                  Search by
                </label>
                <select
                  id="selectDoctor"
                  className="selector"
                  onChange={(e) => setSelectDoctor(e.currentTarget.value)}
                >
                  {[
                    "Doctor",
                    "top-center",
                    "top-end",
                    "middle-start",
                    "middle-center",
                    "middle-end",
                    "bottom-start",
                    "bottom-center",
                    "bottom-end",
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-input">
                <label className="search-label" htmlFor="location">
                  Locations
                </label>
                <input
                  type="text"
                  id="location"
                  className="selector"
                  placeholder="Enter your location"
                />
              </div>

              <div className="search-btn-container">
                <button type="submit" className="search-btn">
                  Search
                </button>
              </div>
            </div>
          </form>
        </Formik>
      </div>
    </div>
  );
}

export default SearchSection;
