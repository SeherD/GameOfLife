import React, {Component} from 'react'

export default class SkillsCard extends Component {

    render() {
        return(
            <div className = "skillCard">
                <img src={this.props.image} alt="skills display"/>
                <p>{this.props.cert ? "Certification: " : "Skill: "}{this.props.skill}</p>
                <p>Payoff at Retirement: {this.props.payoff}</p>
                <p>{this.props.cert ? "Payraise: " + this.props.raise : ""}</p>

            </div>
        )
    }
}