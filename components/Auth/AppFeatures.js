const AppFeatures = () => {
  return (
    <div>
      <img
        src="/assets/images/logo-white.svg"
        alt="bona fide logo white"
        className="logo-white"
      />
      <h6 className="mt-5 mb-5">Humanize Online Shopping</h6>
      <ul className="features-list">
        <li>
          <img src="/assets/images/bullhorn.svg" alt="" />
          <span className="ml-3">Connect your website</span>
        </li>
        <li>
          <img src="/assets/images/invite.svg" alt="" />
          <span className="ml-3">Upload your products</span>
        </li>
        <li>
          <img src="/assets/images/networking.svg" alt="" />
          <span className="ml-3">Invite content creators</span>
        </li>
        <li>
          <img src="/assets/images/text-file.svg" alt="" />
          <span className="ml-3">Start doing livestreams</span>
        </li>
      </ul>
    </div>
  )
}

export default AppFeatures
