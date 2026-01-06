'use client'

import Link from 'next/link'

export default function AboutPage() {
  const coreServices = [
    {
      icon: '🚚',
      title: 'Hyperlocal Delivery',
      description: 'Fast food delivery, groceries, and essentials from nearby merchants.'
    },
    {
      icon: '🛵',
      title: 'Ride & Mobility Services',
      description: 'Quick bike rides and local transport options for short distances.'
    },
    {
      icon: '📦',
      title: 'Parcel & Courier Services',
      description: 'Reliable intra-city parcel delivery for individuals and businesses.'
    },
    {
      icon: '🎟️',
      title: 'Deals & Digital Vouchers',
      description: 'Exclusive discounts, offers, and promotional vouchers for users.'
    },
    {
      icon: '🧑‍💼',
      title: 'Merchant & Partner Solutions',
      description: 'Powerful dashboards, analytics, and tools for merchants, riders, and agents.'
    }
  ]

  const whyChoosePoints = [
    { icon: '⚡', text: 'Lightning-fast hyperlocal fulfillment' },
    { icon: '🔐', text: 'Secure & transparent transactions' },
    { icon: '📍', text: 'Real-time tracking & smart routing' },
    { icon: '🤝', text: 'Strong local partner network' },
    { icon: '📱', text: 'User-friendly apps & dashboards' },
    { icon: '🧠', text: 'Data-driven decision making' }
  ]

  const trustPoints = [
    'Verified riders & merchants',
    'Secure payment infrastructure',
    'Data privacy & protection standards',
    'Transparent pricing & order status',
    'Dedicated support & grievance handling'
  ]

  const values = [
    { icon: '⚡', title: 'Speed', description: 'Because time matters' },
    { icon: '💎', title: 'Integrity', description: 'Transparency in every transaction' },
    { icon: '🚀', title: 'Innovation', description: 'Constantly improving experiences' },
    { icon: '🤝', title: 'Inclusion', description: 'Growth for everyone in the ecosystem' },
    { icon: '🛡️', title: 'Reliability', description: 'Services you can depend on' }
  ]

  const roadmapItems = [
    'Expansion to more cities',
    'AI-powered smart routing & recommendations',
    'More services under one platform',
    'Enhanced merchant analytics & insights',
    'Deeper community partnerships'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fb] via-white to-[#f0f4f8]">
      {/* Back to Home Button */}
      <section className="pt-24 pb-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              color: '#4b2ad4'
            }}
          >
            <i className="fas fa-arrow-left text-[13px]"></i>
            <span>Get back to Home</span>
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pt-4 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#16c2a5] via-[#4b2ad4] to-[#ff6b35] bg-clip-text text-transparent">
            About GatiMitra
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-text mb-4">
            Moving India Forward
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#16c2a5] to-[#4b2ad4] mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-text-light leading-relaxed max-w-3xl mx-auto">
            GatiMitra is a next-generation hyperlocal services platform built to simplify everyday needs. 
            From food delivery and local rides to parcel logistics and digital services, GatiMitra connects 
            users, merchants, and delivery partners on a single, reliable ecosystem designed for speed, 
            transparency, and trust.
          </p>
          <p className="text-base text-text-light leading-relaxed max-w-3xl mx-auto mt-4">
            We are building technology that empowers local businesses, creates earning opportunities, 
            and delivers seamless experiences to customers across India.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Vision */}
          <div 
            className="rounded-[24px] p-8 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-3xl font-black text-text mb-4">Our Vision</h2>
            <p className="text-text-light leading-relaxed">
              To become India&apos;s most trusted hyperlocal platform by enabling faster movement of people, 
              goods, and services—while uplifting local communities through technology.
            </p>
          </div>

          {/* Mission */}
          <div 
            className="rounded-[24px] p-8 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-3xl font-black text-text mb-4">Our Mission</h2>
            <ul className="space-y-3 text-text-light">
              <li className="flex items-start">
                <span className="text-purple mr-2">•</span>
                To make hyperlocal services fast, affordable, and accessible
              </li>
              <li className="flex items-start">
                <span className="text-purple mr-2">•</span>
                To empower local merchants with digital reach
              </li>
              <li className="flex items-start">
                <span className="text-purple mr-2">•</span>
                To create sustainable earning opportunities for riders & partners
              </li>
              <li className="flex items-start">
                <span className="text-purple mr-2">•</span>
                To build secure, scalable, and transparent technology
              </li>
              <li className="flex items-start">
                <span className="text-purple mr-2">•</span>
                To deliver exceptional user experience across all services
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-text mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((service, index) => (
              <div
                key={index}
                className="rounded-[20px] p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-text mb-2">{service.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose GatiMitra */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[rgba(22,194,165,0.05)] to-[rgba(75,42,212,0.05)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-text mb-12">
            Why Choose GatiMitra?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChoosePoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)'
                }}
              >
                <span className="text-2xl">{point.icon}</span>
                <span className="text-text font-medium">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center text-text mb-8">
            Built with Modern Technology
          </h2>
          <div
            className="rounded-[24px] p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            <p className="text-text-light leading-relaxed mb-6">
              GatiMitra is powered by modern, scalable technologies to ensure reliability and performance at every stage:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-purple">✓</span>
                <span className="text-text">Cloud-based architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple">✓</span>
                <span className="text-text">Real-time location & order tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple">✓</span>
                <span className="text-text">Secure authentication & role-based access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple">✓</span>
                <span className="text-text">Advanced search & analytics systems</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple">✓</span>
                <span className="text-text">Scalable APIs for future expansion</span>
              </div>
            </div>
            <p className="text-text-light leading-relaxed">
              Our tech stack is designed to handle high traffic, multiple services, and real-time operations 
              without compromising speed or security.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[rgba(75,42,212,0.05)] to-[rgba(22,194,165,0.05)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center text-text mb-4">
            Trust, Safety & Transparency
          </h2>
          <p className="text-center text-text-light mb-8 italic">
            Your trust is our responsibility.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)'
                }}
              >
                <span className="text-green-500">✓</span>
                <span className="text-text font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empowering Local India */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center text-text mb-8">
            Empowering Local Communities
          </h2>
          <div
            className="rounded-[24px] p-8 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            <p className="text-lg text-text-light leading-relaxed">
              GatiMitra is more than a delivery platform—it&apos;s a growth engine for local India.
              We help small businesses expand digitally, provide flexible income opportunities to riders, 
              and ensure customers get reliable services from trusted local partners.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[rgba(22,194,165,0.05)] to-[rgba(75,42,212,0.05)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-text mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-[20px] p-6 text-center group hover:-translate-y-2 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="text-lg font-bold text-text mb-1">{value.title}</h3>
                <p className="text-sm text-text-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="py-16 px-4 md:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center text-text mb-8">
            What&apos;s Next for GatiMitra
          </h2>
          <div
            className="rounded-[24px] p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="space-y-4">
              {roadmapItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-purple text-xl">→</span>
                  <span className="text-text-light text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

