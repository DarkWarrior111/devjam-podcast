import { Dialog, Transition } from '@headlessui/react'
import React, { Dispatch, Fragment, useState } from 'react'
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaPlusCircle,
  FaTag,
  FaTimesCircle,
} from 'react-icons/fa'

const AboutModal = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<React.SetStateAction<boolean>>
}) => {
  function closeModal() {
    setOpen(false)
  }

  function openModal() {
    setOpen(true)
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-20 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500/50" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="scroller relative my-8 inline-block max-h-[90vh] w-full max-w-3xl transform overflow-hidden overflow-y-auto rounded bg-gray-300 p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white">
                <button onClick={closeModal} className="absolute top-2 right-2">
                  <FaTimesCircle size={32} />
                </button>

                <div className="prose prose-gray w-full max-w-[100%] text-sm dark:prose-invert sm:text-base">
                  <h1>Welcome to DevJam Podcast</h1>

                  <p>
                    This site was created as a part of{' '}
                    <a href="https://devjam.org" className="text-blue-500">
                      Devjam
                    </a>
                    .
                  </p>

                  <h2>Features</h2>

                  <ol>
                    <li>
                      <h3>Search for podcasts.</h3>

                      <p>
                        You can search for podcast using title, owner or
                        author. <br />
                        Additionally, you can also search for podcast using
                        categories by clicking on <FaTag className="inline" />{' '}
                        on the left of the search bar. This enables category
                        search mode and you can search using the categories.
                        Separate categories by a space and use hyphen( - )
                        before a category to exclude it from the search results.
                        <br />
                        Eg: food -news gives results which contain food category
                        and any result containing news category is excluded
                      </p>
                    </li>
                    <li>
                      <h3>View podcast information.</h3>

                      <p>
                        You can see more information about the podcast by
                        clicking on the title of the podcast
                      </p>
                    </li>

                    <li>
                      <h3>Listen to podcasts.</h3>

                      <p>
                        You can listen to podcasts by clicking on the
                        thumbnail of the episode. You can also queue podcasts
                        by clicking on plus icon ({' '}
                        <FaPlusCircle className="inline" /> ) in the episode
                        information.
                        <br />
                        You can listen to all the episodes of a podcast by
                        clicking on play all and selecting the order to play
                        the episodes in.
                      </p>
                    </li>
                    <li>
                      <h3>Add podcasts to favourite.</h3>

                      <p>
                        You can add podcasts and remove them from favourites
                        by clicking on the heart icon in the podcast title.
                      </p>
                    </li>
                  </ol>

                  <h2>Podcast Player</h2>

                  <p>
                    When a user first plays a podcast, a player is shown at the
                    bottom of the screen.
                    <br />
                    The player is used to control the playback of the podcast.
                    You can play/pause the podcast, seek, go
                    forwards/backwards by 5 seconds, adjust the volume of the
                    podcast, play next/previous podcast and see the queue.
                    <br />
                    Progress and playlist are saved locally so the user can pick
                    off where they left off.
                    <br />
                    The player also supports some shortcut keys:
                    <table className="table-auto border-collapse">
                      <tr>
                        <th className="border px-2">Shortcut key</th>
                        <th className="border px-2">Action</th>
                      </tr>
                      <tr>
                        <td className="border px-2">Space</td>
                        <td className="border px-2">Play/Pause</td>
                      </tr>
                      <tr>
                        <td className="border px-2">
                          Ctrl + <FaArrowRight className="inline" />
                        </td>
                        <td className="border px-2">Go forward by 5 seconds</td>
                      </tr>
                      <tr>
                        <td className="border px-2">
                          Ctrl + <FaArrowLeft className="inline" />
                        </td>
                        <td className="border px-2">
                          Go backward by 5 seconds
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-2">
                          Ctrl + <FaArrowUp className="inline" />
                        </td>
                        <td className="border px-2">Increase volume by 10%</td>
                      </tr>
                      <tr>
                        <td className="border px-2">
                          Ctrl + <FaArrowDown className="inline" />
                        </td>
                        <td className="border px-2">Decrease volume by 10%</td>
                      </tr>

                      <tr>
                        <td className="border px-2">m</td>
                        <td className="border px-2">Mute/Unmute</td>
                      </tr>
                      <tr>
                        <td className="border px-2">n</td>
                        <td className="border px-2">Play next podcast</td>
                      </tr>
                      <tr>
                        <td className="border px-2">p</td>
                        <td className="border px-2">Play previous podcast</td>
                      </tr>
                    </table>
                  </p>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AboutModal
