class TimersDashboard extends React.Component {
  state = {
    timers: []
  };

  componentDidMount() {
    this.loadTimersFromServers();
    setInterval(this.loadTimersFromServers, 5000);
  }

  loadTimersFromServers = () => {
    client.getTimers(serverTimers => this.setState({ timers: serverTimers }));
  };

  handleCreateFormSubmit = timer => {
    this.createTimer(timer);
  };

  handleEditFormSubmit = attrs => {
    this.updateTimer(attrs);
  };

  handleTrashClick = timerId => {
    this.deleteTimer(timerId);
  };

  handleStartClick = timerId => {
    this.startTimer(timerId);
  };

  handleStopClick = timerId => {
    this.stopTimer(timerId);
  };

  createTimer = timer => {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t)
    });

    client.createTimer(t);
  };

  updateTimer = attrs => {
    this.setState({
      timers: this.state.timers.map(timer => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project
          });
        } else {
          return timer;
        }
      })
    });

    client.updateTimer(attrs);
  };

  deleteTimer = timerId => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    });

    client.deleteTimer({
      id: timerId
    });
  };

  startTimer = timerId => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map(t => {
        if (t.id === timerId) {
          return Object.assign({}, t, {
            runningSince: now
          });
        } else {
          return t;
        }
      })
    });

    client.startTimer({
      id: timerId,
      start: now
    });
  };

  stopTimer = timerId => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map(t => {
        const lastElapsed = now - t.runningSince;
        if (t.id === timerId) {
          return Object.assign({}, t, {
            elapsed: t.elapsed + lastElapsed,
            runningSince: null
          });
        } else {
          return t;
        }
      })
    });

    client.stopTimer({
      id: timerId,
      stop: now
    });
  };

  handleResetClick = timerId => {
    this.setState({
      timers: this.state.timers.map(timer => {
        if (timer.id === timerId) {
          return Object.assign({}, timer, { elapsed: 0 });
        } else {
          return timer;
        }
      })
    });

    client.resetTimer({ id: timerId });
  };

  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onDelete={this.handleDeleteClick}
            onTrashClick={this.handleTrashClick}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
            onResetClick={this.handleResetClick}
          />
          <ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit} />
        </div>
      </div>
    );
  }
}

class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map(timer => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
        onResetClick={this.props.onResetClick}
      />
    ));
    return <div id="timers">{timers}</div>;
  }
}

class EditableTimer extends React.Component {
  state = {
    editFormOpen: false
  };
  handleEditClick = () => {
    this.openForm();
  };
  handleFormClose = () => {
    this.closeForm();
  };
  handleSubmit = timer => {
    this.props.onFormSubmit(timer);
    this.closeForm();
  };
  closeForm = () => {
    this.setState({ editFormOpen: false });
  };
  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <TimerForm
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <Timer
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
          onResetClick={this.props.onResetClick}
        />
      );
    }
  }
}

class TimerForm extends React.Component {
  state = {
    title: this.props.title || "",
    project: this.props.project || ""
  };

  handleTitleChange = e => {
    this.setState({ title: e.target.value });
  };

  handleProjectChange = e => {
    this.setState({ project: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project
    });
  };

  render() {
    const submitText = this.props.id ? "Update" : "Create";
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input
                type="text"
                value={this.state.title}
                onChange={this.handleTitleChange}
              />
            </div>
            <div>
              <label>Project</label>
              <input
                type="text"
                value={this.state.project}
                onChange={this.handleProjectChange}
              />
            </div>
            <div className="ui two bottom attached buttons">
              <button
                className="ui basic blue button"
                onClick={this.handleSubmit}
              >
                {submitText}
              </button>
              <button
                className="ui basic red button"
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {
  state = {
    isOpen: false
  };
  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };
  handleFormClose = () => {
    this.setState({ isOpen: false });
  };
  handleFormSubmit = timer => {
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  };
  render() {
    if (this.state.isOpen) {
      return (
        <TimerForm
          onFormClose={this.handleFormClose}
          onFormSubmit={this.handleFormSubmit}
        />
      );
    } else {
      return (
        <div className="ui basic content center aligned segment">
          <button
            onClick={this.handleFormOpen}
            className="ui basic button icon"
          >
            <i className="plus icon" />
          </button>
        </div>
      );
    }
  }
}

class Timer extends React.Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => {
      this.forceUpdate(), 1000;
    });
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };

  handleStartClick = () => {
    this.props.onStartClick(this.props.id);
  };

  handleStopClick = () => {
    this.props.onStopClick(this.props.id);
  };

  handleResetClick = () => {
    this.props.onResetClick(this.props.id);
  };

  render() {
    const elapsedString = helpers.renderElapsedString(
      this.props.elapsed,
      this.props.runningSince
    );
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="header">{this.props.title}</div>
          <div className="meta">{this.props.project}</div>
          <div className="center aligned description">
            <h2>{elapsedString}</h2>
          </div>
          <div className="extra content">
            <span
              onClick={this.props.onEditClick}
              className="right floated edit icon"
            >
              <i className="edit icon" />
            </span>
            <span
              onClick={this.handleTrashClick}
              className="right floated trash icon"
            >
              <i className="trash icon" />
            </span>
          </div>
        </div>
        <TimerActionButton
          timerIsRunning={!!this.props.runningSince}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
          onResetClick={this.handleResetClick}
          elapsed={this.props.elapsed}
        />
      </div>
    );
  }
}

class TimerActionButton extends React.Component {

    render() {
      return(
      this.props.timerIsRunning ? 
      (
        <button 
        className='ui bottom attached red basic button'
        onClick={this.props.onStopClick}
        >
        Stop
        </button>
      )
      :
      this.props.elapsed ? 
      (
        <div class="ui two bottom attached buttons">
          <div 
          className='ui basic button blue'
          onClick={this.props.onStartClick}
          >
          Start
          </div>
          <div 
          className='ui basic button green'
          onClick={this.props.onResetClick}
          >
          Reset
          </div>
        </div>
      )
      :
      (
          <button 
          className='ui bottom attached blue basic button'
          onClick={this.props.onStartClick}
          >
          Start
          </button>
        )
      )
      }
    }

ReactDOM.render(<TimersDashboard />, document.getElementById("content"));
