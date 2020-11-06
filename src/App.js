import React from 'react';
import DataTable from 'react-data-table-component';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.searchData = this.searchData.bind(this);
    

    this.state = {
      data: [],
      search_results: []
    };

    this.search_column = [
      {
        name: "Full Name",
        selector: "name",
        grow: 2
      },
    ];
  }
  render() {
	  
    return (
      <div>
        <div>
          <label for="name">Enter a provider first name:</label>
          <input type="text" placeholder="first name" id="inputSearchId"/>
        </div>
		<div>
          <label for="org_name">Enter a orgainazation provider name:</label>
          <input type="text" placeholder="orgainazation name" id="inputOrgId"/>
        </div>
		<div>
          <button className="Search" type="button" onClick={this.searchData}>Search</button>
        </div>
		<DataTable title="Health Provider Information" columns={this.search_column} data={this.state.search_results} pagination={true}/>
      </div>
    );
  }
	
	
	searchData() {
    const name = document.getElementById('inputSearchId');
    const org_name = document.getElementById('inputOrgId');
    fetch('https://cors-anywhere.herokuapp.com/https://npiregistry.cms.hhs.gov/api/?first_name=' + name.value + '&organization_name=' + org_name.value + '&version=2.1&limit=200', {headers: {
      'Access-Control-Allow-Origin' : '*',
      'Origin': ''
    }}).then((response) => response.json())
    .then((responseJson) => {
      var search_info = [];
      if (responseJson.results) {
        for (var p = 0; p < responseJson.results.length; p++) {
          var search_name = "";
          var result = responseJson.results[p];
          if (result.enumeration_type === 'NPI-2') {
             search_name = result.basic.authorized_official_first_name + ' ' + result.basic.authorized_official_last_name;
          }
          else {
             search_name = result.basic.first_name + ' ' + result.basic.last_name;
          }
          search_info.push({'name': search_name, 'number': result.number});
        }
      }
      console.log(search_info);
      this.setState({ search_results: search_info, data: [] })})
    }
  }
  
  export default App;
