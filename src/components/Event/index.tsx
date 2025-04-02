"use client";
import { canCreateContent, canEditContent, canDeleteContent, Role } from "@/utils/roles";
import { Calendar, MapPin, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Event {
  id: string;
  createdAt: string;
  title: string;
  place: string;
  status: string;
  description?: string;
  creator: {
    name: string;
    email?: string;
  };
  familyId: string;
}

interface EventProps {
  events: Event[];
  familyId: string;
  fetchFamily: () => void;
  currentUserRole: Role
}

const Event = ({
  events: initialEvents,
  familyId,
  fetchFamily,
  currentUserRole
}: EventProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedEvent) return;

    try {
      const updatedEvent = { ...selectedEvent, status: newStatus };
      setSelectedEvent(updatedEvent);

      // Update the events list
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event,
        ),
      );

      const response = await fetch(
        `/api/family/${familyId}/event/${selectedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update event status");
      }

      setIsModalOpen(false);
    } catch (error) {
      setSelectedEvent(selectedEvent);
      setEvents(events);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      console.log("familyId:", familyId, "eventId:", eventId);
      const response = await fetch(`/api/family/${familyId}/event/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      const result = await response.json();
      toast.success("event deleted successfully");
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between p-4 pb-0">
              <div
                className={`
            rounded-full px-3 py-1 text-xs font-medium
            ${
              event.status === "pending"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
            }
          `}
              >
                {event.status === "pending" ? "Pending" : "Completed"}
              </div>

              <div className="flex space-x-2">
                {canDeleteContent(currentUserRole)&&(
                  <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                  title="Delete Event"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                )}
                
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                {new Date(event.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-gray-800 dark:text-white">
                {event.title}
              </h3>

              <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg
                  className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="line-clamp-1">{event.place}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg
                  className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Hosted by {event.creator.name}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4  dark:border-gray-700">
              <button
                onClick={() => handleViewDetails(event)}
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="animate-fade-in-up relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
            <div className="border-b border-gray-100 p-6 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedEvent.title}
                  </h2>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {new Date(selectedEvent.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </h3>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">
                    {selectedEvent.place}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <User className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Host
                  </h3>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">
                    {selectedEvent.creator.name}
                  </p>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="flex items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </h3>
                    <p className="mt-1 whitespace-pre-line text-gray-800 dark:text-gray-200">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 border-t border-gray-100 p-6 dark:border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-800"
              >
                Close
              </button>
              {canEditContent(currentUserRole) && (
                <div className="">
                  {selectedEvent.status === "pending" ? (
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
                    >
                      Mark as Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange("pending")}
                      className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:from-yellow-600 dark:to-yellow-700 dark:hover:from-yellow-700 dark:hover:to-yellow-800"
                    >
                      Reopen Event
                    </button>
                  )}
                </div>
              )}
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Event;
