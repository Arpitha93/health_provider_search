import React from 'react';
import ReactDOM from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  {
    name: "Full Name",
    selector: "name"
  },
  {
    name: "NPI number",
    selector: "number"
  },
  {
    name: "Phone Number",
    selector: "phone_num"
  },
  {
    name: "Accepted Insurance",
    selector: "accepted_insurance",
    grow: 3
  },
  {
    name: "Location Address",
    selector: "address",
    grow: 3
  }
];



class App extends React.Component {
  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.searchData = this.searchData.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.copyURL = this.copyURL.bind(this);

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
      {
          cell:(row) => <button id={row.number} value={row.number} onClick={e => this.handleButtonClick(e.target.value)}>View Details</button>,
          ignoreRowClick: true,
          allowOverflow: true,
          button: true
      }
    ];
  }
  render() {
    let table;
    if (this.state.data.length > 0) {
      table = <DataTable title="Health Provider Detailed Information" columns={columns} data={this.state.data}/>
} else if (this.state.search_results.length > 0) {
  table = <DataTable title="Health Provider Information" columns={this.search_column} data={this.state.search_results} pagination={true}/>
}
else {
  table = <p>No results</p>
}
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
        {table}
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
      this.setState({ search_results: search_info, data: [] })})
    }

    handleButtonClick(value){

        this.fetchData(value);
    }

    copyURL(value){
        value = "https://npiregistry.cms.hhs.gov/api/?number=" + value + "&version=2.1"
        console.log(value);
        document.execCommand('copy');
    }

  fetchData(number) {
    fetch('https://cors-anywhere.herokuapp.com/https://npiregistry.cms.hhs.gov/api/?number='+ number + '&version=2.1', {headers: {
      'Access-Control-Allow-Origin' : '*',
      'Origin': ''
    }}).then((response) => response.json())
    .then((responseJson) => {
      var myData = [];
      if (responseJson.results) {
        for (var m = 0; m < responseJson.results.length; m++) {
          var result = responseJson.results[m];
          console.log(result);
          if (result.enumeration_type === 'NPI-2') {
            var name = result.basic.authorized_official_first_name + ' ' + result.basic.authorized_official_last_name;
          }
          else {
            var prefix = result.basic.name_prefix;
            if(prefix == null)
              prefix = "";
            var name = prefix + ' ' + result.basic.first_name + ' ' + result.basic.last_name;
          }
          var address = "";
          var phone_num = "";
          var accepted_insurance = [];
          for (var i = 0; i < result.addresses.length; i++) {
            if (result.addresses[i].address_purpose === 'LOCATION') {
              address = result.addresses[i].address_1 + ' ' +   result.addresses[i].address_2 + ' ' + result.addresses[i].city + ' ' + result.addresses[i].state + ' ' + result.addresses[i].postal_code;
              phone_num = result.addresses[i].telephone_number;
              break;
            }
          }
          for (var i = 0; i < result.identifiers.length; i++) {
            console.log(result.identifiers[i].issuer);
            var issuer = "";
            if(result.identifiers[i].issuer.length > 0 ){
              issuer = result.identifiers[i].issuer;
            }
            else {
              issuer = result.identifiers[i].desc;
            }
            accepted_insurance.push(issuer);
          }
          myData.push({'name': name,
        'address':address,
        'phone_num': phone_num,
        'number': result.number,
        'accepted_insurance': accepted_insurance.map((insurance) => <li>{insurance}</li>)
      });
        }
    }

      this.setState({ data: myData, search_results: []})})

  }
}
export default App;
