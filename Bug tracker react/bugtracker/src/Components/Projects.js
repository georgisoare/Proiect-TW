import React from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions } from 'react-dialog';
import '../App.css';
import { render } from '@testing-library/react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import AddProject from '../AddProject';



export default class ProjectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            projects: [],
            value: 'nimic',
            proj: 0,
            bugsIsOpen: false,
            bugName:"N/A",
            bugLink: "N/A",
            bugDescription: "N/A",
            bugSeverity: "low",
            bugPriority: "low",
            AddSolution:false,
            bugIdForSolution: 0,
            bugToReserve: 0,
            linkForBug: "",

        }

    }




    componentDidMount() {
        axios.get('http://localhost:8000/api/getProjectsWithMembers').then(res => {
            this.setState({ projects: res.data });
        });


    }


    render() {


        return (
            <div>
                <AddProject />
                <ul id={"projectsList"}>
                    {


                        this.state.projects.map(project =>

                            <li key={project.Id} onClick={(e) => {
                                this.HandleSubmit(e);
                            }}>
                                <label class="projectnames">
                                    {project.ProjectName}
                                </label>
                                <table>
                                    <th>Project</th>
                                    <tr>Repository Link:</tr>
                                    <tr>{project.RepositoryLink}</tr>
                                </table>

                                <table>
                                    <th>Members</th>
                                    <tr><button id={"addbtn"} onClick={() => { this.setModalIsOpen(true, project.Id); }} >{"ADD MEMBER"}</button></tr>

                                    <Modal isOpen={this.state.modalIsOpen}>
                                        <div class="member-modal-div" >
                                            <div>
                                                <label style={{ margin: '5px' }} >{"Member name: "}</label>
                                                <input id={"Member"} onInput={(e) => this.setState({ value: e.target.value })}></input>
                                            </div>
                                            <button style={{ width: '100px' }} onClick={() => this.addMember(this.state.proj)}>Add member</button>
                                            <button style={{ width: '100px' }} onClick={() => this.setState({ modalIsOpen: false })}>Close</button>

                                        </div>
                                    </Modal>

                                    {project.Members.map(member => <tr>{member.MemberEmail}</tr>)}
                                </table>
                                <table>
                                    <th>Bugs</th>
                                    <tr><button  value={project.Bugs.Id} onClick={() => { this.setBugsIsOpen(true,project.Id) }}>{"ADD BUG"}</button></tr>

                                    <Modal isOpen={this.state.bugsIsOpen}>
                                        <div class="vertical">
                                            <div class="label-input">

                                                <label>Name</label>
                                                <input type="text" onInput={(e)=>{this.setState({bugName:e.target.value})}}></input>

                                            </div>
                                            <div class="label-input">
                                                <label>Priority</label>
                                                <select onChange={(e)=>{this.setState({bugPriority:e.target.value})}}>
                                                    <option value="low">low</option>
                                                    <option value="mid">mid</option>
                                                    <option value="high">high</option>
                                                </select>
                                            </div>
                                            <div class="label-input">
                                                <label>Description</label>
                                                <input type="text" onInput={(e)=>{this.setState({bugDescription:e.target.value})}}></input>
                                            </div>
                                            <div class="label-input">
                                                <label>Severity</label>
                                                <select onChange={(e)=>{this.setState({bugSeverity:e.target.value})}}>
                                                    <option value="minimal">minimal</option>
                                                    <option value="medium">medium</option>
                                                    <option value="critical">critical</option>
                                                </select>
                                            </div>
                                            <div class="label-input">
                                                <label>Link</label>
                                                <input type="text" onInput={(e)=>{this.setState({bugLink:e.target.value})}}></input>
                                            </div>
                                            <div class="btn-bug">
                                                <button onClick={()=>{this.addBug()}}>SAVE</button>
                                                <button onClick={()=>{this.setState({bugsIsOpen:false})}}>CLOSE</button>
                                            </div>

                                        </div>
                                    </Modal>

                                    <tr>{project.Bugs.map(bug => <table id="bugs-table">
                                        <th>{"Name: "}{bug.BugName}</th>
                                        <tr><button onClick={()=>{this.reserveBug(bug.Id,localStorage.getItem("id"),project.Id)}}>RESERVE BUG</button><button onClick={()=>{this.addSolution(true,bug.Id,project.Id)}}>ADD SOLUTION</button>
                                        <Modal isOpen={this.state.AddSolution}>
                                            <div class="solution-add-div">
                                            <input id="solution-add-input" onInput={(e)=>{this.setState({linkForBug:e.target.value})}}></input>
                                            <button id="solution-add-button" onClick={()=>{this.addLinkToSolution()}}>SAVE</button>
                                            <button id="solution-add-button" onClick={()=>{this.setState({AddSolution: false})}}>CLOSE</button>
                                            </div>
                                        </Modal>
                                        </tr>
                                        <tr>{"Description: "}{bug.BugDescription}</tr>
                                        <tr>{"Priority: "}{bug.BugPriority}</tr>
                                        <tr>{"Severity: "}{bug.BugSeverity}</tr>
                                        <tr>{"Link to bug: "}{bug.BugLink}</tr>
                                        <tr>{"Status: "}{bug.BugStatus}</tr>
                                        <tr>{"Reserved by (member id): "}{bug.BugReservationId}</tr>
                                        
                                        <tr>{"Solution link: "}{bug.BugSolutionLink}</tr>
                                        
                                    </table>
                                    )}</tr>
                                </table>
                            </li>



                        )
                    }
                </ul>

            </div>
        )
    }

    HandleSubmit(e) {
        // console.log(e.target.innerHTML);
        //console.log(e.target.key);
        // console.log(this.state.bugSeverity);
       // console.log(this.state.bugIdForSolution);
    }

    HandleKey(id) {
        console.log(id);
    }

    addSolution(bool,id,proj)
    {   this.setState({bugIdForSolution:id});


      fetch('http://localhost:8000/api/CheckIfMp/'+proj+'/'+localStorage.getItem("id"))
      .then(res=>res.json())
      .then(data=>{
          if(data.length > 0)
          {
            this.setState({AddSolution:bool});
          }
          else
          {
              alert("You are not a member of this project!");
          }
      })


       
    }

    addMember(idProj) {





        fetch('http://localhost:8000/api/getMemberByName/' + this.state.value).then(response => response.json()).then(data => {
            if (data.length < 1) {
                alert("nu exista userul");
            }
            else {


                axios.post('http://localhost:8000/api/addMemberToProject3', {
                    id: data[0].Id,
                    projId: idProj
                }).then(window.location.reload()).then(console.log(idProj));




            }
        })



    }


    addLinkToSolution()
    {
         
       axios.post('http://localhost:8000/api/addLinkToBug',{
           bugid: this.state.bugIdForSolution,
           link: this.state.linkForBug
       }).then(()=>{window.location.reload()}).then(()=>{this.setState({AddSolution:false})})

    }

    reserveBug(bug,member,proj)
    {

        this.setState({bugToReserve:bug})
        

        fetch('http://localhost:8000/api/CheckIfMp/'+proj+'/'+member).then(res2=>res2.json()).then(data2=>{
            if(data2.length>0)
            {
                 

                fetch('http://localhost:8000/api/getBugReservation/'+bug).then(res=>res.json()).then(data=>{
            if(data[0].BugReservationId >0)
            {   
                alert("Bug is already reserved!")
            }
            else
            {
                axios.post('http://localhost:8000/api/reserveBug',{
                    MemberId:member,
                    BugId: bug
                }).then(window.location.reload());
            }
        })

            }
            else
            {    
                alert("You are not a member of this project!")
            }
        })
           
        

        
    }

    addBug()
    {
              
        
       // console.log(this.state.proj,this.state.bugLink,this.state.bugDescription,this.state.bugSeverity,this.state.bugName);

               if(this.state.proj!= 0 ){
               axios.post('http://localhost:8000/api/addBug',{
                   BugName: this.state.bugName,
                   BugPriority: this.state.bugPriority,
                   BugSeverity: this.state.bugSeverity,
                   BugDescription: this.state.bugDescription,
                   BugLink: this.state.bugLink,
                   ProjectId: this.state.proj

               }).then(()=>{console.log("ok")}).then(window.location.reload());
            }
              

    }

    getMembers(projectId) {
        this.state.members.setState({})

    }

    setModalIsOpen(bool, id) {
        var username = localStorage.getItem("username");
        this.setState({ proj: id });



        fetch('http://localhost:8000/api/getMemberByName/' + username).then(response => response.json()).then(data => {

            fetch('http://localhost:8000/api/checkIfMp/' + id + '/' + data[0].Id).then(res => res.json()).then(info => {
                if (info.length < 1) {
                    console.log(info, data[0].Id, id);
                    alert("Nu esti membru al acestui proiect!");
                }
                else {
                    this.setState({ modalIsOpen: bool });
                }

            })


        })



    }

    setBugsIsOpen(bool,id) {



        fetch('http://localhost:8000/api/CheckIfMp/'+id+'/'+localStorage.getItem("id"))
        .then(res=>res.json())
        .then(data=>{
            if(data.length > 0)
            {
                this.setState({proj:id, bugsIsOpen: bool,bugName:"N/A",bugDescription:"N/A",bugLink:"N/A",bugSeverity:"minimal",bugPriority:"low" });
            }
            else
            {
                alert("You are not a member of this project!");
            }
        })
  
  
        

       
        
    }

}

